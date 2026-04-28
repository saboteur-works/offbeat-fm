"use client";
import { useState } from "react";
import { Button } from "@mda/components";
import axiosInstance from "../util/axiosInstance";

interface ReAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReAuthModal({
  isOpen,
  onSuccess,
  onClose,
}: ReAuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axiosInstance.post("/user/re-auth", { password });
      setPassword("");
      onSuccess();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setError("Incorrect password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-ob-bg-md border border-ob-border-md rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Confirm your password</h2>
        <p className="text-sm text-brand-mid mb-4">
          Enter your current password to continue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Current password"
            className="w-full"
            autoFocus
            required
          />
          {error && <p className="text-brand-red text-sm">{error}</p>}
          <div className="flex gap-3 pt-1">
            <Button
              label={loading ? "Confirming…" : "Confirm"}
              category="primary"
              type="submit"
            />
            <Button
              label="Cancel"
              category="outline"
              onClick={() => {
                setPassword("");
                setError(null);
                onClose();
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
