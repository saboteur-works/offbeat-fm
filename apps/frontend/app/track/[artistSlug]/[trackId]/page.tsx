"use client";
import axios from "axios";
import { use } from "react";
import { useAppSelector } from "../../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteTracks } from "../../../../lib/features/users/userSlice";
import { ExternalLinkList, TrackHeader, TrackRow } from "@mda/components";
import axiosInstance from "../../../../util/axiosInstance";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { HeartPlus, HeartMinus } from "lucide-react";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data.data);
export default function TrackPage({
  params,
}: {
  params: Promise<{ artistSlug: string; trackId: string }>;
}) {
  const { artistSlug, trackId } = use(params);
  const router = useRouter();
  const { data: trackData } = useSWR(
    `/track/slug/${trackId}/artist/${artistSlug}?includeArt=true`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  const { data: similarTracks } = useSWR(
    () => {
      return `/tracks/${trackData._id}/similar`;
    },
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const trackFavorited = user.favoriteTracks.includes(trackData?._id);

  const likeTrack = async () => {
    try {
      if (!user.loggedIn) {
        throw new Error("User must be logged in to like a track");
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tracks/${trackData._id}/favorite`,
        {
          userId: user.userId,
          trackId: trackData._id,
          remove: trackFavorited,
        },
        { withCredentials: true },
      );
      dispatch(setFavoriteTracks(response.data.data));
    } catch (error) {
      console.error("Error liking track:", error);
    }
  };

  function formatSecondsToMMSS(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Pad with a leading zero if the number is less than 10
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  if (!trackData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="track-page" className="w-full flex flex-col p-4 h-full">
      <div id="track-details" className="mr-8 ">
        <TrackHeader
          trackTitle={trackData.title}
          artistName={trackData.artistId?.name}
          genre={trackData.genre}
          artistSlug={trackData.artistId?.slug}
          duration={formatSecondsToMMSS(trackData.duration) ?? "Unknown"}
          imgUrl={
            trackData.trackArt
              ? `data:image/jpeg;base64,${trackData.trackArt}`
              : undefined
          }
        />
        {user.loggedIn ? (
          <div onClick={likeTrack} className="cursor-pointer">
            {trackFavorited ? (
              <HeartMinus className="size-5 fill-pink-600 hover:fill-pink-700" />
            ) : (
              <HeartPlus className="size-5 fill-gray-400 hover:fill-pink-700" />
            )}
          </div>
        ) : (
          <p className="italic">Log in to add this track to your favorites</p>
        )}

        {trackData.album && <a href="#">{trackData.album}</a>}
        <div id="track-external-links" className="w-full">
          <ExternalLinkList
            links={trackData.links}
            linkContainerType="cloud"
            title="Listen on"
            containerClasses="mb-4 mt-4"
          />
        </div>
      </div>
      <hr />
      <div id="track-suggestions" className="">
        <h2 className="font-mono text-brand-mid text-ob-label uppercase mb-4 mt-4 tracking-label-wide">
          You might also like
        </h2>
        {similarTracks && similarTracks.length > 0 ? (
          <div className="flex flex-col md:flex-wrap md:flex-row gap-4">
            {similarTracks.map((track) => (
              <TrackRow
                key={track._id}
                trackSlug={track.slug}
                trackTitle={track.title}
                artistSlug={track.artistSlug}
              />
            ))}
          </div>
        ) : (
          <p>No similar tracks found.</p>
        )}
      </div>
    </div>
  );
}
