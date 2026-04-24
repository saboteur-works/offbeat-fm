"use client";
import { use, useEffect, useState } from "react";
import { Button } from "@mda/components";
import axiosInstance from "../../../util/axiosInstance";
import Link from "next/link";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    axiosInstance
      .get(`/auth/verify-email/${token}`)
      .then((res) => {
        setMessage(res.data.message);
        setStatus("success");
      })
      .catch((err) => {
        setMessage(
          err?.response?.data?.message ?? "Something went wrong. Please try again."
        );
        setStatus("error");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <h1 className="text-3xl font-bold mb-4">Email Verification</h1>

      {status === "loading" && <p>Verifying your email…</p>}

      {status === "success" && (
        <div className="flex flex-col items-center space-y-4">
          <p>{message}</p>
          <Link href="/login">
            <Button label="Go to Login" category="outline" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-red-500">{message}</p>
          <Link href="/login">
            <Button label="Back to Login" category="outline" />
          </Link>
        </div>
      )}
    </div>
  );
}
