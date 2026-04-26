"use client";

import { use, useState } from "react";
import { useAppSelector } from "../../../lib/hooks";
import { ArtistHeader, ExternalLinkList } from "@mda/components";
import useSWR from "swr";
import axiosInstance from "../../../util/axiosInstance";
import setFavoriteEditorialProfile from "../../../actions/setFavoriteEditorialProfile";
import { HeartPlus, HeartMinus } from "lucide-react";

const editorialFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data.data);

export default function EditorialProfilePage({
  params,
}: {
  params: Promise<{ editorialArtistName: string }>;
}) {
  const slug = use(params).editorialArtistName;
  const user = useAppSelector((state) => state.user);

  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR(`/editorial/slug/${slug}?includeArt=true`, editorialFetcher, {
    revalidateOnFocus: false,
  });

  const isFavorited = profile?.favoritedBy?.includes(user.username) ?? false;
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const effectiveFavorited = favorited ?? isFavorited;

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleFavoriteClick = async () => {
    try {
      await setFavoriteEditorialProfile(profile._id, effectiveFavorited);
      setFavorited(!effectiveFavorited);
    } catch (err) {
      console.error("Error updating editorial favourite:", err);
    }
  };

  const handleClaimClick = async () => {
    setClaiming(true);
    try {
      await axiosInstance.post(`/editorial/${profile._id}/claim`);
      setClaimed(true);
      mutate({ ...profile, claimStatus: "claimed" }, false);
    } catch (err) {
      console.error("Error claiming editorial profile:", err);
    } finally {
      setClaiming(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        An error occurred while loading this profile. It may not exist or there
        was a server error.
      </div>
    );
  }

  const showClaimCta =
    user.loggedIn &&
    !claimed &&
    profile.claimStatus === "unclaimed";

  return (
    <div id="editorial-page" className="flex flex-col py-2 px-4 w-full">
      <div id="editorial-details" className="mr-8">
        <ArtistHeader
          name={profile.name}
          meta=""
          genre={profile.genre}
          imageUrl={
            profile.artistArt
              ? `data:image/jpeg;base64,${profile.artistArt}`
              : undefined
          }
        />

        <span className="text-xs uppercase tracking-widest text-ob-red border border-ob-red px-2 py-0.5 mb-4 inline-block">
          Editorial Profile
        </span>

        {user.loggedIn ? (
          <div onClick={handleFavoriteClick} className="cursor-pointer mb-4">
            {effectiveFavorited ? (
              <HeartMinus className="size-5 hover:fill-pink-700 fill-pink-600" />
            ) : (
              <HeartPlus className="size-5 hover:fill-pink-700 fill-gray-400" />
            )}
          </div>
        ) : (
          <p className="italic mb-4">
            Log in to add this profile to your favourites
          </p>
        )}

        <section id="editorial-biography">
          <p className="p-4 text-brand-mid italic">
            {profile.biography ?? "No biography available."}
          </p>
        </section>
        <hr />
      </div>

      <div className="mt-4 flex flex-col md:flex-row gap-8">
        <div id="editorial-links" className="w-full md:w-1/2">
          {profile.links && Object.keys(profile.links).length > 0 ? (
            <ExternalLinkList
              links={profile.links}
              linkContainerType="cloud"
              containerClasses="mb-4 mt-4"
              title="Find me on"
            />
          ) : (
            <p className="text-ob-dim">No links available.</p>
          )}
        </div>

        {showClaimCta && (
          <div
            id="editorial-claim"
            className="w-full md:w-1/2 border border-ob-red p-4"
          >
            <p className="text-ob-label tracking-label uppercase mb-2 text-ob-red">
              Is this you?
            </p>
            <p className="mb-4 text-brand-mid italic">
              This profile was created by an OffBeat editor. If you are this
              artist, you can claim it and take ownership.
            </p>
            <button
              onClick={handleClaimClick}
              disabled={claiming}
              className="text-ob-red border border-ob-red px-4 py-2 uppercase tracking-widest text-xs hover:bg-ob-red hover:text-white transition-colors disabled:opacity-50"
            >
              {claiming ? "Claiming…" : "Claim this profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
