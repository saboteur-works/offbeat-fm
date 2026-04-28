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

  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernamePending, setUsernamePending] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernamePending(true);
    try {
      await axiosInstance.patch("/user/username", { newUsername });
      setUsernameSuccess(true);
      setShowUsernameForm(false);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (res?.status === 409) {
        setUsernameError("That username is already taken.");
      } else {
        setUsernameError(res?.data?.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setUsernamePending(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordPending(true);
    try {
      await axiosInstance.patch("/user/password", { currentPassword, newPassword });
      setPasswordSuccess(true);
      setShowPasswordForm(false);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (res?.status === 401) {
        setPasswordError("Current password is incorrect.");
      } else {
        setPasswordError(res?.data?.message ?? "Something went wrong. Please try again.");
      }
    } finally {
      setPasswordPending(false);
    }
  };

  const renderUsernameSection = () => {
    if (usernameSuccess) {
      return (
        <p className="text-sm text-green-400">
          Username updated to <strong>{newUsername}</strong>.
        </p>
      );
    }
    if (showUsernameForm) {
      return (
        <form onSubmit={handleUsernameSubmit} className="flex flex-col space-y-3 max-w-sm">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="New username"
            required
          />
          {usernameError && (
            <p className="text-brand-red text-sm">{usernameError}</p>
          )}
          <div className="flex gap-3">
            <Button
              label={usernamePending ? "Saving…" : "Save"}
              category="primary"
              type="submit"
            />
            <Button
              label="Cancel"
              category="outline"
              onClick={() => {
                setShowUsernameForm(false);
                setNewUsername("");
                setUsernameError(null);
              }}
            />
          </div>
        </form>
      );
    }
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{user.username}</span>
        <Button
          label="Change username"
          category="outline"
          onClick={() => {
            setUsernameError(null);
            setShowUsernameForm(true);
          }}
        />
      </div>
    );
  };

  const renderPasswordSection = () => {
    if (passwordSuccess) {
      return (
        <p className="text-sm text-green-400">
          Password changed. Redirecting you to log in…
        </p>
      );
    }
    if (showPasswordForm) {
      return (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col space-y-3 max-w-sm">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
          />
          {passwordError && (
            <p className="text-brand-red text-sm">{passwordError}</p>
          )}
          <div className="flex gap-3">
            <Button
              label={passwordPending ? "Saving…" : "Save"}
              category="primary"
              type="submit"
            />
            <Button
              label="Cancel"
              category="outline"
              onClick={() => {
                setShowPasswordForm(false);
                setCurrentPassword("");
                setNewPassword("");
                setPasswordError(null);
              }}
            />
          </div>
        </form>
      );
    }
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">••••••••</span>
        <Button
          label="Change password"
          category="outline"
          onClick={() => {
            setPasswordError(null);
            setShowPasswordForm(true);
          }}
        />
      </div>
    );
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
        <div>
          <p className="text-ob-label uppercase text-brand-mid tracking-label mb-2">
            Username
          </p>
          {renderUsernameSection()}
        </div>
        <div>
          <p className="text-ob-label uppercase text-brand-mid tracking-label mb-2">
            Password
          </p>
          {renderPasswordSection()}
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
