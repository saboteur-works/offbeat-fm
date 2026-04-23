"use client";
import useSWR from "swr";
import axiosInstance from "../../../util/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((r) => r.data);

interface EditorialProfile {
  _id: string;
  name: string;
  genre: string;
  claimStatus: "unclaimed" | "claimed" | "converted";
  verificationStatus: "unverified" | "pending" | "verified";
}

export default function AdminDashboardPage() {
  const { data: editorialData } = useSWR<{ data: EditorialProfile[] }>(
    "/admin/editorial",
    fetcher,
  );
  const profiles = editorialData?.data ?? [];

  const counts = profiles.reduce(
    (acc, p) => {
      acc[p.claimStatus] = (acc[p.claimStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <section>
        <h2 className="text-lg font-semibold mb-3">Editorial Profiles</h2>
        <div className="grid grid-cols-3 gap-4">
          {(["unclaimed", "claimed", "converted"] as const).map((status) => (
            <div key={status} className="border border-ob-border rounded p-4">
              <p className="text-sm text-ob-dim capitalize">{status}</p>
              <p className="text-3xl font-bold">{counts[status] ?? 0}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
