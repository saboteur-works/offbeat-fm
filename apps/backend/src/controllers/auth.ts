import crypto from "crypto";
import { Request, Response } from "express";
import {
  clearVerificationToken,
  createUser,
  getUserByEmail,
  getUserByVerificationToken,
  setVerificationToken,
} from "../db/actions/User";
import {
  createUserCreatedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import { userFormValidators } from "@common/validation";
import { sendVerificationEmail } from "../utils/email";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const generateVerificationToken = () => {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
};

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:3000";

export const signUp = async (req: Request, res: Response) => {
  try {
    const values = await userFormValidators.signUpSchema.validate(req.body);
    const user = await createUser(values);

    const { raw, hash } = generateVerificationToken();
    const expiry = new Date(Date.now() + TOKEN_TTL_MS);
    await setVerificationToken(user.id, hash, expiry);

    const verificationUrl = `${getClientUrl()}/verify-email/${raw}`;
    await sendVerificationEmail(user.email, verificationUrl);

    logServerEvent(createUserCreatedEvent(user.username));
    return res.status(200).json({
      message:
        "Sign up successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.params["token"];
    if (!token) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await getUserByVerificationToken(tokenHash);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    await clearVerificationToken(user.id);
    return res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  const genericResponse = {
    message:
      "If an account with that email exists and is unverified, a new link has been sent.",
  };

  try {
    const { email } = req.body;
    if (!email) return res.status(200).json(genericResponse);

    const user = await getUserByEmail(email);
    if (user && user.accountStatus === "pending") {
      const { raw, hash } = generateVerificationToken();
      const expiry = new Date(Date.now() + TOKEN_TTL_MS);
      await setVerificationToken(user.id, hash, expiry);

      const verificationUrl = `${getClientUrl()}/verify-email/${raw}`;
      await sendVerificationEmail(user.email, verificationUrl);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error during resend verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req: Request, res: Response) => {
  const {
    password,
    __v,
    emailVerificationToken,
    emailVerificationExpiry,
    ...returnUser
  } = req.user.toObject();
  return res
    .status(200)
    .json({ message: "Login successful", user: returnUser });
};

export const checkAuth = (req: Request, res: Response) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  if (req.isAuthenticated()) {
    const {
      password,
      __v,
      emailVerificationToken,
      emailVerificationExpiry,
      ...returnUser
    } = req.user.toObject();
    if (returnUser.accountStatus !== "active") {
      return res.status(401).json({ message: "User account is not active." });
    }
    return res.status(200).json({ authenticated: true, user: returnUser });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session during logout:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });
};
