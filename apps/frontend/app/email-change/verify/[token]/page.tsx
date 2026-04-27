"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@mda/components";
import axiosInstance from "../../../../util/axiosInstance";
import Link from "next/link";

type Status = "loading" | "success" | "error" | "cooldown" | "conflict";

export default function EmailChangeVerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    axiosInstance
      .get(`/user/email/verify/${token}`)
      .then(() => setStatus("success"))
      .catch((err: unknown) => {
        const httpStatus = (err as { response?: { status?: number } })?.response?.status;
        if (httpStatus === 429) setStatus("cooldown");
        else if (httpStatus === 409) setStatus("conflict");
        else setStatus("error");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center py-16 w-full">
      <h1 className="text-3xl font-bold mb-4">Email Verification</h1>

      {status === "loading" && <p>Verifying your new email address…</p>}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p>Your email address has been updated successfully.</p>
          <p className="text-sm text-brand-mid">
            You have been logged out of all sessions. Please log in with your
            new email address.
          </p>
          <Link href="/login">
            <Button label="Go to Login" category="outline" />
          </Link>
        </div>
      )}

      {status === "cooldown" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-brand-red">Email change limit reached.</p>
          <p className="text-sm text-brand-mid">
            You may change your email up to 2 times per 24 hours. Please try
            again later.
          </p>
          <Link href="/settings/user">
            <Button label="Back to Settings" category="outline" />
          </Link>
        </div>
      )}

      {status === "conflict" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-brand-red">Email address unavailable.</p>
          <p className="text-sm text-brand-mid">
            That email address has been registered by another account. Please
            contact support.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-brand-red">
            This link is invalid or has expired.
          </p>
          <p className="text-sm text-brand-mid">
            Please request a new email change from your account settings.
          </p>
          <Link href="/settings/user">
            <Button label="Back to Settings" category="outline" />
          </Link>
        </div>
      )}
    </div>
  );
}
