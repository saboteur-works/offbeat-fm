"use client";
import { Button } from "@mda/components";
import { useAppSelector } from "../../../lib/hooks";
import { useState } from "react";
import deleteUser from "../../../actions/deleteUser";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "../../../util/axiosInstance";
import ReAuthModal from "../../../commonComponents/ReAuthModal";

interface UserVitalSettingsProps {
  setCurrentPage?: (page: string) => void;
}
export default function UserVitalSettings({
  setCurrentPage,
}: UserVitalSettingsProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [preDelete, setPreDelete] = useState(false);

  const [showReAuthModal, setShowReAuthModal] = useState(false);
  const [reAuthDone, setReAuthDone] = useState(false);
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null);
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);

  const handleChangeEmailClick = () => {
    setEmailChangeError(null);
    if (reAuthDone) {
      setShowEmailChangeForm(true);
    } else {
      setShowReAuthModal(true);
    }
  };

  const handleReAuthSuccess = () => {
    setReAuthDone(true);
    setShowReAuthModal(false);
    setShowEmailChangeForm(true);
  };

  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailChangeError(null);
    setEmailChangePending(true);
    try {
      await axiosInstance.post("/user/email/change", { newEmail });
      setEmailChangeSuccess(true);
      setShowEmailChangeForm(false);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (res?.status === 401) {
        setReAuthDone(false);
        setShowEmailChangeForm(false);
        setShowReAuthModal(true);
      } else if (res?.status === 409) {
        setEmailChangeError("That email address is already in use.");
      } else if (res?.status === 429) {
        setEmailChangeError("Too many requests. Please try again later.");
      } else {
        setEmailChangeError(
          res?.data?.message ?? "Something went wrong. Please try again.",
        );
      }
    } finally {
      setEmailChangePending(false);
    }
  };

  const renderEmailSection = () => {
    if (emailChangeSuccess) {
      return (
        <p className="text-sm text-green-400">
          A verification link was sent to <strong>{newEmail}</strong>. Check
          your current email inbox for a security notification.
        </p>
      );
    }
    if (showEmailChangeForm) {
      return (
        <form onSubmit={handleEmailChangeSubmit} className="flex flex-col space-y-3 max-w-sm">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            required
          />
          {emailChangeError && (
            <p className="text-brand-red text-sm">{emailChangeError}</p>
          )}
          <div className="flex gap-3">
            <Button
              label={emailChangePending ? "Sending…" : "Send verification"}
              category="primary"
              type="submit"
            />
            <Button
              label="Cancel"
              category="outline"
              onClick={() => {
                setShowEmailChangeForm(false);
                setNewEmail("");
                setEmailChangeError(null);
              }}
            />
          </div>
        </form>
      );
    }
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.email}</span>
        <Button
          label="Change email"
          category="outline"
          onClick={handleChangeEmailClick}
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold ">User Settings</h1>
      <div id="user-settings-form" className="w-full mt-4 flex flex-col space-y-6">
        <div>
          <p className="text-ob-label uppercase text-brand-mid tracking-label mb-2">
            Email address
          </p>
          {renderEmailSection()}
        </div>
        <Button
          label="Back to Settings"
          category="outline"
          onClick={() => setCurrentPage && setCurrentPage("favorites")}
        />
      </div>

      <ReAuthModal
        isOpen={showReAuthModal}
        onSuccess={handleReAuthSuccess}
        onClose={() => setShowReAuthModal(false)}
      />

      <div className="mt-8 border-t border-ob-border-md pt-4">
        <p className="text-ob-label uppercase text-brand-mid tracking-label mb-4">
          Account Deletion
        </p>
        <Button
          label="Delete Account"
          category="destructive"
          onClick={() => setPreDelete(true)}
        />
        <p className="text-sm text-brand-mid mt-2">
          Permanently deletes your account, favorites, and all associated data.
          This cannot be undone.
        </p>
        {preDelete && (
          <div className="mt-4">
            <p className="text-brand-red">
              Are you absolutely sure you want to delete your account?{" "}
            </p>
            <p className="text-brand-red">
              <strong>This action cannot be undone.</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                label="Yes, Delete My Account"
                category="destructive"
                onClick={async () => {
                  const deletionSuccess = await deleteUser(user.userId as string);
                  if (deletionSuccess) {
                    toast.success("Account deleted successfully.");
                    router.push("/");
                  } else {
                    toast.error("There was an error deleting your account.");
                    setPreDelete(false);
                  }
                }}
              />
              <Button
                label="Cancel"
                onClick={() => setPreDelete(false)}
                category="outline"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
