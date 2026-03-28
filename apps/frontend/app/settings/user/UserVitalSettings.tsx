"use client";
import { Button } from "@mda/components";
import { useAppSelector } from "../../../lib/hooks";
import { useState } from "react";
import deleteUser from "../../../actions/deleteUser";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface UserVitalSettingsProps {
  setCurrentPage?: (page: string) => void;
}
export default function UserVitalSettings({
  setCurrentPage,
}: UserVitalSettingsProps) {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [preDelete, setPreDelete] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold ">User Settings</h1>
      <div id="user-settings-form" className="w-full">
        <form className="flex flex-col space-y-4 w-full mt-4">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            label="Update Settings"
            onClick={() => {}}
            category="primary"
          />
          <Button
            label="Back to Settings"
            category="outline"
            onClick={() => setCurrentPage && setCurrentPage("favorites")}
          />
        </form>
      </div>
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
                  const deletionSuccess = await deleteUser(user.userId);
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
