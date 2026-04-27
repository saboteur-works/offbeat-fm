import crypto from "crypto";
import { Request, Response } from "express";
import { object, string } from "yup";
import {
  getFavoriteArtists as getFavoriteArtistsAction,
  getFavoriteTracks as getFavoriteTracksAction,
  getFavorites as getFavoritesAction,
  getManagedArtists as getManagedArtistsAction,
  deleteUser as deleteUserAction,
  setEmailChangeTokens,
  getUserByEmail,
  getUserByUsername,
  getUserByEmailChangeVerifyToken,
  getUserByEmailChangeCancelToken,
  confirmEmailChange as confirmEmailChangeAction,
  cancelEmailChange as cancelEmailChangeAction,
  updateUser,
} from "../db/actions/User";
import User from "../db/models/User";
import {
  createUserDeletedEvent,
  createEmailChangeInitiatedEvent,
  createEmailChangeConfirmedEvent,
  createEmailChangeCancelledEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import {
  maskEmail,
  sendEmailChangeVerificationEmail,
  sendEmailChangeNotificationEmail,
  sendEmailChangeConfirmedEmail,
} from "../utils/email";
import { redisClient } from "../lib/redis";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const CANCEL_TOKEN_TTL_MS = 72 * 60 * 60 * 1000;

const changeEmailSchema = object({
  newEmail: string().email("Must be a valid email.").required("Email is required."),
});

const changeUsernameSchema = object({
  newUsername: string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .required("Username is required."),
});

const changePasswordSchema = object({
  currentPassword: string().required("Current password is required."),
  newPassword: string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters.")
    .required("New password is required."),
});

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:3000";

const generateToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
};

const isEmailChangeCooldownExceeded = async (userId: string): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    const key = `rl:email-change-count:${userId}`;
    const val = await redisClient.get(key);
    return val !== null && parseInt(val) >= 2;
  } catch (err) {
    console.error("Redis email change cooldown check failed:", err);
    return false;
  }
};

const incrementEmailChangeCooldown = async (userId: string): Promise<void> => {
  if (!redisClient) return;
  try {
    const key = `rl:email-change-count:${userId}`;
    const count = await redisClient.incr(key);
    if (count === 1) await redisClient.expire(key, 86400);
  } catch (err) {
    console.error("Redis email change cooldown increment failed:", err);
  }
};

export const getManagedArtists = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  try {
    const userId = req.user._id;
    const artists = await getManagedArtistsAction(userId);
    res.status(200).json({ status: "OK", data: artists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavoriteArtists = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const favoriteArtists = await getFavoriteArtistsAction(userId);
    res.status(200).json({ status: "OK", data: favoriteArtists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavoriteTracks = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const favoriteTracks = await getFavoriteTracksAction(userId);
    res.status(200).json({ status: "OK", data: favoriteTracks });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  // include track artist info
  const includeTrackArtistData = req.query.includeTrackArtistData === "true";
  try {
    const userId = req.user._id;
    const favorites = await getFavoritesAction(userId, includeTrackArtistData);
    res.status(200).json({ status: "OK", favorites });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "User ID is required" });
    }
    // Ensure the user is deleting their own account
    if (req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ status: "ERROR", message: "Unauthorized to delete this user" });
    }

    await deleteUserAction(userId);
    logServerEvent(createUserDeletedEvent(userId, req.user.username));
    res
      .status(200)
      .json({ status: "OK", message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const reAuth = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required." });
    }
    const userDoc = await User.findById(req.user._id);
    if (!userDoc) {
      return res.status(401).json({ message: "User not found." });
    }
    const isValid = await userDoc.checkPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    req.session.reAuthAt = Date.now();
    return res.status(200).json({ message: "Re-authentication successful." });
  } catch (error) {
    console.error("Error during re-auth:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const initiateEmailChange = async (req: Request, res: Response) => {
  try {
    let values: { newEmail: string };
    try {
      values = await changeEmailSchema.validate(req.body);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid input.";
      return res.status(400).json({ message });
    }

    const newEmail = values.newEmail.toLowerCase().trim();
    const currentEmail = req.user.email.toLowerCase();

    if (newEmail === currentEmail) {
      return res
        .status(400)
        .json({ message: "New email must differ from your current email." });
    }

    const [existingActive, existingPending] = await Promise.all([
      getUserByEmail(newEmail),
      User.findOne({ pendingEmail: newEmail, _id: { $ne: req.user._id } }),
    ]);

    if (existingActive || existingPending) {
      return res
        .status(409)
        .json({ message: "That email address is already in use." });
    }

    const { raw: rawVerify, hash: hashVerify } = generateToken();
    const { raw: rawCancel, hash: hashCancel } = generateToken();
    const verifyExpiry = new Date(Date.now() + VERIFY_TOKEN_TTL_MS);
    const cancelExpiry = new Date(Date.now() + CANCEL_TOKEN_TTL_MS);

    await setEmailChangeTokens(
      req.user._id.toString(),
      newEmail,
      hashVerify,
      verifyExpiry,
      hashCancel,
      cancelExpiry,
      currentEmail,
    );

    const clientUrl = getClientUrl();
    const verifyUrl = `${clientUrl}/email-change/verify/${rawVerify}`;
    const cancelUrl = `${clientUrl}/email-change/cancel/${rawCancel}`;

    await sendEmailChangeVerificationEmail(newEmail, verifyUrl);
    await sendEmailChangeNotificationEmail(
      req.user.email,
      maskEmail(newEmail),
      cancelUrl,
    );

    logServerEvent(
      createEmailChangeInitiatedEvent(
        req.user._id.toString(),
        maskEmail(newEmail),
        req.ip ?? "unknown",
      ),
    );

    return res.status(200).json({
      message: "A verification email has been sent to your new address.",
    });
  } catch (error) {
    console.error("Error initiating email change:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyEmailChange = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await getUserByEmailChangeVerifyToken(tokenHash);
    if (!user || !user.pendingEmail) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }

    const userId = user._id.toString();
    const cooldownExceeded = await isEmailChangeCooldownExceeded(userId);
    if (cooldownExceeded) {
      return res.status(429).json({
        message:
          "Email change limit reached. You may change your email up to 2 times per 24 hours.",
      });
    }

    const emailTaken = await getUserByEmail(user.pendingEmail);
    if (emailTaken && emailTaken._id.toString() !== userId) {
      return res.status(409).json({
        message:
          "That email address has been registered by another account. Please contact support.",
      });
    }

    const newEmail = user.pendingEmail;
    await confirmEmailChangeAction(userId, newEmail);
    await incrementEmailChangeCooldown(userId);

    await sendEmailChangeConfirmedEmail(newEmail).catch((err) =>
      console.error("Failed to send email change confirmed email:", err),
    );

    logServerEvent(createEmailChangeConfirmedEvent(userId));

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Email updated successfully. Please log in again.",
      });
    });
  } catch (error) {
    console.error("Error verifying email change:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const changeUsername = async (req: Request, res: Response) => {
  try {
    let values: { newUsername: string };
    try {
      values = await changeUsernameSchema.validate(req.body);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid input.";
      return res.status(400).json({ message });
    }

    const newUsername = values.newUsername.trim();
    const existing = await getUserByUsername(newUsername);
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: "That username is already taken." });
    }

    await updateUser(req.user._id.toString(), { username: newUsername });
    return res.status(200).json({ username: newUsername });
  } catch (error) {
    console.error("Error changing username:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    let values: { currentPassword: string; newPassword: string };
    try {
      values = await changePasswordSchema.validate(req.body);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid input.";
      return res.status(400).json({ message });
    }

    const userDoc = await User.findById(req.user._id);
    if (!userDoc) {
      return res.status(401).json({ message: "User not found." });
    }

    const isValid = await userDoc.checkPassword(values.currentPassword);
    if (!isValid) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    userDoc.password = values.newPassword;
    await userDoc.save();

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Password updated. Please log in again." });
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const cancelEmailChange = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Invalid or expired cancellation link." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await getUserByEmailChangeCancelToken(tokenHash);
    if (!user || !user.emailChangeOriginalEmail) {
      return res
        .status(400)
        .json({ message: "Invalid or expired cancellation link." });
    }

    const originalEmail = user.emailChangeOriginalEmail;
    const existingOwner = await getUserByEmail(originalEmail);
    if (existingOwner && existingOwner._id.toString() !== user._id.toString()) {
      return res.status(409).json({
        message:
          "Your original email address is no longer available. Please contact support.",
      });
    }

    await cancelEmailChangeAction(user._id.toString(), originalEmail);
    logServerEvent(createEmailChangeCancelledEvent(user._id.toString()));

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({
        message:
          "Email change cancelled. Your original email has been restored.",
      });
    });
  } catch (error) {
    console.error("Error cancelling email change:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
