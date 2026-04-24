import { Resend } from "resend";
import { readFileSync } from "fs";

const getApiKey = (): string => {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY;
  try {
    return readFileSync("/run/secrets/RESEND_API_KEY", "utf-8").trim();
  } catch {
    throw new Error("RESEND_API_KEY is not configured");
  }
};

const resend = new Resend(getApiKey());

const FROM_ADDRESS = process.env.EMAIL_FROM || "onboarding@resend.dev";

export const sendVerificationEmail = async (
  toEmail: string,
  verificationUrl: string,
): Promise<void> => {
  await resend.emails.send({
    from: FROM_ADDRESS,
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
