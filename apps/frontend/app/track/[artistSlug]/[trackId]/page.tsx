"use client";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { useAppSelector } from "../../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteTracks } from "../../../../lib/features/users/userSlice";
import { ExternalLinkList, ImgContainer, SidebarButton } from "@mda/components";
import axiosInstance from "../../../../util/axiosInstance";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { YouTubeEmbed } from "@next/third-parties/google";
import SpotifyEmbed from "../../../../embedding/spotify";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data.data);
export default function TrackPage({
  params,
}: {
  params: Promise<{ artistSlug: string; trackId: string }>;
}) {
  const { artistSlug, trackId } = use(params);
  const router = useRouter();
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
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

  const getYoutubeVideoId = () => {
    if (trackData?.links && Object.keys(trackData.links).includes("YouTube")) {
      const youtubeLink = trackData.links["YouTube"];
      const r = /youtube.com\/watch\?v=([a-zA-Z0-9-_]+)/;
      const match = youtubeLink.match(r);
      if (match && match[1]) {
        setYoutubeVideoId(match[1]);
      }
    }
  };

  useEffect(() => {
    getYoutubeVideoId();
  }, [trackData]);

  if (!trackData) {
    return <div>Loading...</div>;
  }

  return (
    <div id="track-page" className="flex flex-col p-4 md:flex-row grow h-full">
      <div id="track-details" className="mr-8 md:w-8/12 md:overflow-y-auto">
        <h1 className="text-2xl font-bold">{trackData.title}</h1>
        {trackData.artistId?.name && (
          <a href={`/artists/${trackData.artistId.slug}`}>
            {trackData.artistId.name}
          </a>
        )}
        <ImgContainer
          src={
            trackData.trackArt
              ? `data:image/jpeg;base64,${trackData.trackArt}`
              : undefined
          }
          alt="Album Art"
        />
        {user.loggedIn ? (
          <div onClick={likeTrack} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`size-5 hover:fill-pink-700 ${trackFavorited ? "fill-pink-600" : "fill-gray-400"}`}
            >
              <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
            </svg>
          </div>
        ) : (
          <p className="italic">Log in to add this track to your favorites</p>
        )}

        {trackData.album && <a href="#">{trackData.album}</a>}
        {trackData.duration && (
          <p>Duration: {formatSecondsToMMSS(trackData.duration)}</p>
        )}
        <div id="track-external-links">
          <ExternalLinkList
            links={trackData.links}
            linkContainerType="cloud"
            title="Listen on"
            containerClasses="mb-4 mt-4"
          />
        </div>
        <div id="embeds">
          <h2 className="text-xl font-semibold">Embedded Media</h2>
          <div className="mt-4">
            {youtubeVideoId && <YouTubeEmbed videoid={youtubeVideoId} />}
          </div>
          {/* <div className="mt-4">
            <SpotifyEmbed />
          </div> */}
        </div>
      </div>

      <div
        id="track-suggestions"
        className="grow md:border-l md:border-gray-300 md:pl-8 overflow-y-auto"
      >
        <h2 className="text-xl font-semibold md:text-center">
          You might also like
        </h2>
        {similarTracks && similarTracks.length > 0 ? (
          <div>
            {similarTracks.map((track) => (
              <SidebarButton
                textAlign="left"
                label={`${track.title} by ${track?.artistName}`}
                key={track._id}
                onClick={() => {
                  router.push(`/track/${track.artistSlug}/${track.slug}`);
                }}
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
