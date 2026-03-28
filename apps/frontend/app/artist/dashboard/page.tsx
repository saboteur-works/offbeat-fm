"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../lib/hooks";
import getManagedArtists from "../../../actions/getManagedArtists";
import { Button } from "@mda/components";
import useAuth from "../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../commonComponents/AccessUnauthorized";
import Link from "next/link";

export default function Page() {
  const { isLoading, error } = useAuth();
  const [managedArtists, setManagedArtists] = useState([]);
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user.userId) {
      getManagedArtists(user.userId).then((data) => {
        setManagedArtists(data.data || []);
      });
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <AccessUnauthorized />;
  }

  return (
    <div className="p-4">
      <h1 className="text-ob-display font-bold">Artist Dashboard</h1>
      <p className="mb-4">
        Welcome to your dashboard, where you can manage your music and profile.
      </p>
      {managedArtists.length === 0 && (
        <div>
          <p>
            You currently aren't managing any artists. Complete the Artist Setup
            form below to get started.
          </p>
          <p>By signing up, you assert that:</p>
          <ul className="list-disc list-inside">
            <li>
              You are the rightful owner or have the necessary rights to manage
              the artist profile.
            </li>
            <li>You have released music under the artist's name.</li>
            <li>You agree to our terms of service and privacy policy.</li>
            <li>You will provide accurate and truthful information.</li>
          </ul>
          <Link href="/artist/dashboard/create-artist">
            <Button label="Create Artist Profile" category="primary" />
          </Link>
        </div>
      )}
      {managedArtists.length > 0 && (
        <div>
          <Link href="/artist/dashboard/create-artist">
            <Button label="Create new Artist Profile" category="primary" />
          </Link>
          <h2 className="text-xl font-bold mt-4 mb-4">Your Managed Artists</h2>
          <div className="flex gap-4">
            {managedArtists.map((artist) => (
              <Button
                key={artist._id}
                label={artist.name}
                category="outline"
                onClick={() => router.push(`/artist/dashboard/${artist._id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
