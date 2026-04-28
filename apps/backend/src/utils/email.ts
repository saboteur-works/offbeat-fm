import { Resend } from "resend";
import { readFileSync } from "fs";

const apiKey = (() => {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY;
  try {
    return readFileSync("/run/secrets/RESEND_API_KEY", "utf-8").trim();
  } catch {
    throw new Error("RESEND_API_KEY is not configured");
  }
})();

const DEV_MODE = apiKey === "dev";
const resend = DEV_MODE ? null : new Resend(apiKey);

const FROM_ADDRESS = process.env.EMAIL_FROM || "onboarding@resend.dev";

export const maskEmail = (email: string): string => {
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}**${domain}`;
};

const sendEmail = async (payload: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  if (DEV_MODE) {
    const urls = payload.html.match(/https?:\/\/[^\s"<]+/g) ?? [];
    console.log(`\n[EMAIL] To: ${payload.to} | ${payload.subject}`);
    urls.forEach((url) => console.log(`  → ${url}`));
    return;
  }
  await resend!.emails.send({ from: FROM_ADDRESS, ...payload });
};

export const sendVerificationEmail = async (
  toEmail: string,
  verificationUrl: string,
): Promise<void> => {
  await sendEmail({
    to: toEmail,
    subject: "Verify your email address",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Verify your email</h2>
        <p>Thanks for signing up. Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${verificationUrl}"
           style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0">
          Verify email
        </a>
        <p style="color:#666;font-size:13px">If you didn't create an account, you can ignore this email.</p>
      </div>
    `,
  });
};

export const sendEmailChangeVerificationEmail = async (
  toEmail: string,
  verifyUrl: string,
): Promise<void> => {
  await sendEmail({
    to: toEmail,
    subject: "Confirm your new email address",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Confirm your new email address</h2>
        <p>You requested an email address change. Click the button below to confirm your new address. This link expires in 24 hours.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0">
          Confirm new email
        </a>
        <p style="color:#666;font-size:13px">If you did not request this change, please use the cancellation link sent to your previous email address.</p>
      </div>
    `,
  });
};

export const sendEmailChangeNotificationEmail = async (
  oldEmail: string,
  maskedNewEmail: string,
  cancelUrl: string,
): Promise<void> => {
  await sendEmail({
    to: oldEmail,
    subject: "Security alert: email change requested for your account",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Email change requested</h2>
        <p>A request was made to change the email address on your account to <strong>${maskedNewEmail}</strong>.</p>
        <p>If this was you, no action is needed. The change will take effect once the new address is verified.</p>
        <p>If you did not make this request, click the button below to cancel it immediately. <strong>This link is valid for 72 hours</strong> — even if the change has already been confirmed.</p>
        <a href="${cancelUrl}"
           style="display:inline-block;padding:12px 24px;background:#c0392b;color:#fff;text-decoration:none;border-radius:4px;margin:16px 0">
          Cancel email change
        </a>
        <p style="color:#666;font-size:13px">If the cancel button does not work, copy and paste this link into your browser: ${cancelUrl}</p>
      </div>
    `,
  });
};

export const sendEmailChangeConfirmedEmail = async (
  newEmail: string,
): Promise<void> => {
  await sendEmail({
    to: newEmail,
    subject: "Your email address has been updated",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Email address updated</h2>
        <p>Your email address has been successfully changed to this address. For your security, you have been logged out of all active sessions.</p>
        <p>Please log in again using your new email address.</p>
        <p style="color:#666;font-size:13px">If you did not make this change, please contact support immediately.</p>
      </div>
    `,
  });
};
