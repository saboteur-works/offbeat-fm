"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import axiosInstance from "../../../util/axiosInstance";
import { Button, ErrorText, FormLabel } from "@mda/components";
import toast from "react-hot-toast";
import Link from "next/link";

const fetcher = (url: string) => axiosInstance.get(url).then((r) => r.data);
const ENDPOINT = "/admin/editorial";

interface EditorialProfile {
  _id: string;
  name: string;
  genre: string;
  claimStatus: "unclaimed" | "claimed" | "converted";
  verificationStatus: "unverified" | "pending" | "verified";
  createdAt?: string;
}

function CreateProfileForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !genre.trim()) {
      setError("Name and genre are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(ENDPOINT, { name, genre, editorialNotes: notes });
      toast.success("Profile created.");
      setName("");
      setGenre("");
      setNotes("");
      onCreated();
    } catch {
      setError("Failed to create profile.");
      toast.error("Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-ob-border rounded p-4 space-y-3 max-w-md">
      <h2 className="font-semibold text-lg">New Editorial Profile</h2>
      <FormLabel>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Artist name"
          className="w-full"
        />
      </FormLabel>
      <FormLabel>
        <input
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
          className="w-full"
        />
      </FormLabel>
      <FormLabel>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes (optional)"
          className="w-full"
          rows={3}
        />
      </FormLabel>
      {error && <ErrorText message={error} />}
      <Button label={loading ? "Creating..." : "Create Profile"} type="submit" category="outline" />
    </form>
  );
}

export default function EditorialPage() {
  const { data, isLoading } = useSWR<{ data: EditorialProfile[] }>(ENDPOINT, fetcher);
  const profiles = data?.data ?? [];

  const refresh = () => mutate(ENDPOINT);

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-bold">Editorial Profiles</h1>
      <CreateProfileForm onCreated={refresh} />
      <section>
        <h2 className="text-lg font-semibold mb-3">All Profiles</h2>
        {isLoading && <p className="text-ob-dim text-sm">Loading...</p>}
        {!isLoading && profiles.length === 0 && (
          <p className="text-ob-dim text-sm">No editorial profiles yet.</p>
        )}
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li key={p._id} className="border border-ob-border rounded p-3 flex items-center justify-between">
              <div>
                <Link href={`/admin/editorial/${p._id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <span className="ml-2 text-sm text-ob-dim">{p.genre}</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="border border-ob-border rounded px-2 py-0.5 capitalize">{p.claimStatus}</span>
                <span className="border border-ob-border rounded px-2 py-0.5 capitalize">{p.verificationStatus}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
