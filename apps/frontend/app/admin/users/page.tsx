"use client";
import { useState } from "react";
import useSWR from "swr";
import axiosInstance from "../../../util/axiosInstance";
import { Button } from "@mda/components";
import toast from "react-hot-toast";

const fetcher = (url: string) => axiosInstance.get(url).then((r) => r.data);

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  accountStatus: "pending" | "active" | "inactive" | "banned";
  role: "user" | "admin";
}

const STATUS_OPTIONS: AdminUser["accountStatus"][] = ["active", "inactive", "banned", "pending"];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const url = submittedSearch
    ? `/admin/users?search=${encodeURIComponent(submittedSearch)}`
    : "/admin/users";

  const { data, isLoading, mutate } = useSWR<{ data: AdminUser[] }>(url, fetcher);
  const users = data?.data ?? [];

  const updateStatus = async (userId: string, status: AdminUser["accountStatus"]) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
      mutate();
      toast.success(`Status updated to ${status}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); setSubmittedSearch(search); }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email"
          className="border border-ob-border rounded px-3 py-2 flex-1"
        />
        <Button label="Search" type="submit" category="outline" />
      </form>

      {isLoading && <p className="text-ob-dim text-sm">Loading...</p>}
      {!isLoading && users.length === 0 && (
        <p className="text-ob-dim text-sm">No users found.</p>
      )}

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            className="border border-ob-border rounded p-3 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-sm text-ob-dim truncate">{user.email}</p>
              {user.role === "admin" && (
                <span className="text-xs bg-yellow-100 text-yellow-800 rounded px-1">admin</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-ob-dim capitalize">{user.accountStatus}</span>
              <select
                className="border border-ob-border rounded px-2 py-1 text-sm"
                value={user.accountStatus}
                onChange={(e) =>
                  updateStatus(user._id, e.target.value as AdminUser["accountStatus"])
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
