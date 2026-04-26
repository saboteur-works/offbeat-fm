"use client";
import { useState } from "react";
import { use } from "react";
import useSWR, { mutate } from "swr";
import axiosInstance from "../../../../util/axiosInstance";
import { Button, ErrorText } from "@mda/components";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => axiosInstance.get(url).then((r) => r.data);

interface EditorialProfile {
  _id: string;
  name: string;
  genre: string;
  biography?: string;
  editorialNotes?: string;
  claimStatus: "unclaimed" | "claimed" | "converted";
  verificationStatus: "unverified" | "pending" | "verified";
  claimedByUserId?: string;
  convertedArtistId?: string;
  createdByAdminId: string;
}

export default function EditorialProfilePage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = use(params);
  const endpoint = `/admin/editorial/${profileId}`;
  const { data, isLoading } = useSWR<{ data: EditorialProfile }>(endpoint, fetcher);
  const profile = data?.data;

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Partial<EditorialProfile>>({});

  if (isLoading) return <p className="text-ob-dim text-sm">Loading...</p>;
  if (!profile) return <p className="text-ob-dim text-sm">Profile not found.</p>;

  const current = { ...profile, ...fields };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(endpoint, fields);
      mutate(endpoint);
      setFields({});
      toast.success("Saved.");
    } catch {
      setError("Failed to save changes.");
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete profile for "${profile.name}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(endpoint);
      toast.success("Profile deleted.");
      router.push("/admin/editorial");
    } catch {
      toast.error("Failed to delete profile.");
    }
  };

  const set = (key: keyof EditorialProfile, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:underline"
        >
          Delete profile
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Artist Name</label>
          <input
            className="w-full border border-ob-border rounded px-3 py-2"
            value={current.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Genre</label>
          <input
            className="w-full border border-ob-border rounded px-3 py-2"
            value={current.genre}
            onChange={(e) => set("genre", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Biography</label>
          <textarea
            className="w-full border border-ob-border rounded px-3 py-2"
            rows={4}
            value={current.biography ?? ""}
            onChange={(e) => set("biography", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            Internal Notes <span className="text-ob-dim">(admin only)</span>
          </label>
          <textarea
            className="w-full border border-ob-border rounded px-3 py-2"
            rows={3}
            value={current.editorialNotes ?? ""}
            onChange={(e) => set("editorialNotes", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Verification Status</label>
          <select
            className="border border-ob-border rounded px-3 py-2"
            value={current.verificationStatus}
            onChange={(e) =>
              set("verificationStatus", e.target.value)
            }
          >
            <option value="unverified">Unverified</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      <div className="border-t border-ob-border pt-4 text-sm text-ob-dim space-y-1">
        <p>Claim status: <span className="capitalize font-medium">{profile.claimStatus}</span></p>
        {profile.claimedByUserId && <p>Claimed by user: {profile.claimedByUserId}</p>}
        {profile.convertedArtistId && <p>Converted to artist: {profile.convertedArtistId}</p>}
        <p>Created by admin: {profile.createdByAdminId}</p>
        {profile.claimStatus === "claimed" && (
          <div className="pt-2">
            <Button
              label={converting ? "Converting..." : "Convert to Artist"}
              type="button"
              category="outline"
              onClick={async () => {
                setConverting(true);
                try {
                  await axiosInstance.post(`/admin/editorial/${profileId}/convert`);
                  mutate(endpoint);
                  toast.success("Artist created and profile converted.");
                } catch (e: unknown) {
                  const msg =
                    e instanceof Error ? e.message : "Failed to convert profile.";
                  toast.error(msg);
                } finally {
                  setConverting(false);
                }
              }}
            />
          </div>
        )}
      </div>

      {error && <ErrorText message={error} />}
      <Button
        label={saving ? "Saving..." : "Save Changes"}
        type="button"
        category="outline"
        onClick={handleSave}
      />
    </div>
  );
}
