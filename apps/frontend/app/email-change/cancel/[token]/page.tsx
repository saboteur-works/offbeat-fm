"use client";
import { use, useState } from "react";
import { Button } from "@mda/components";
import axiosInstance from "../../../../util/axiosInstance";
import Link from "next/link";

type Status = "confirm" | "loading" | "success" | "error" | "conflict";

export default function EmailChangeCancelPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<Status>("confirm");

  const handleCancel = () => {
    setStatus("loading");
    axiosInstance
      .get(`/user/email/cancel/${token}`)
      .then(() => setStatus("success"))
      .catch((err: unknown) => {
        const httpStatus = (err as { response?: { status?: number } })?.response?.status;
        if (httpStatus === 409) setStatus("conflict");
        else setStatus("error");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 w-full">
      <h1 className="text-3xl font-bold mb-4">Cancel Email Change</h1>

      {status === "confirm" && (
        <div className="flex flex-col items-center space-y-4 text-center max-w-sm">
          <p>
            You are about to cancel a pending email change on your account.
            Your original email address will be restored and all active sessions
            will be logged out.
          </p>
          <Button
            label="Cancel email change"
            category="destructive"
            onClick={handleCancel}
          />
        </div>
      )}

      {status === "loading" && <p>Cancelling email change…</p>}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p>Email change cancelled successfully.</p>
          <p className="text-sm text-brand-mid">
            Your original email address has been restored. All active sessions
            have been logged out.
          </p>
          <Link href="/login">
            <Button label="Go to Login" category="outline" />
          </Link>
        </div>
      )}

      {status === "conflict" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-brand-red">Unable to restore original email.</p>
          <p className="text-sm text-brand-mid">
            Your original email address is no longer available. Please contact
            support.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-brand-red">
            This cancellation link is invalid or has expired.
          </p>
          <p className="text-sm text-brand-mid">
            The cancellation window is 72 hours from the time the email change
            was requested.
          </p>
        </div>
      )}
    </div>
  );
}
