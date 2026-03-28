"use client";

import { use } from "react";
import Link from "next/link";
import setFavoriteArtist from "../../../actions/setFavoriteArtist";
import { useAppSelector } from "../../../lib/hooks";
import { useDispatch } from "react-redux";
import { setFavoriteArtists } from "../../../lib/features/users/userSlice";
import { ArtistHeader, TrackRow } from "@mda/components";
import useSWR from "swr";
import SimilarArtists from "./SimilarArtists";
import getRandomArtists from "../../../actions/getRandomArtists";
import axiosInstance from "../../../util/axiosInstance";
import OtherArtists from "./OtherArtists";
import { ExternalLinkList } from "@mda/components";
import { useRouter } from "next/navigation";
import { HeartPlus, HeartMinus } from "lucide-react";

const artistFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data.data);
const similarArtistsFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data.data);
const otherArtistsFetcher = async (exclude: string) =>
  getRandomArtists(exclude);

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const artistId = use(params).artistId;
  const router = useRouter();
  const {
    data: mainArtistData,
    error: mainArtistDataError,
    isLoading: isMainArtistLoading,
  } = useSWR(`/artist/slug/${artistId}?includeArt=true`, artistFetcher, {
    revalidateOnFocus: false,
  });

  const {
    data: similarArtistsData,
    error: similarArtistsError,
    isLoading: isSimilarArtistsLoading,
  } = useSWR(
    () => {
      return `/artist/${mainArtistData._id}/similar?includeArt=true`;
    },
    similarArtistsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const {
    data: otherArtistsData,
    error: otherArtistsError,
    isLoading: isOtherArtistsLoading,
  } = useSWR(
    () => {
      const exclude = [
        artistId,
        ...similarArtistsData.map((artist) => artist._id),
      ].join(",");
      return `${exclude}`;
    },
    otherArtistsFetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const user = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  const artistFavorited = user.favoriteArtists.includes(mainArtistData?._id);

  const handleFavoriteClick = async () => {
    try {
      const response = await setFavoriteArtist(
        mainArtistData._id,
        artistFavorited,
      );
      console.log("Favorite updated:", response);
      dispatch(setFavoriteArtists(response.data));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  if (isMainArtistLoading) {
    return <div>Loading...</div>;
  }
  if (mainArtistDataError) {
    return (
      <div>
        An error occurred while trying to load the artist. The artist might not
        exist or there was a server error.
      </div>
    );
  }

  return (
    <div id="artist-page" className="flex flex-col py-2 px-4 w-full">
      <div id="artist-details" className="mr-8 ">
        <ArtistHeader
          name={mainArtistData.name}
          meta={mainArtistData.meta}
          genre={mainArtistData.genre}
          totalTracks={mainArtistData.tracks.length}
          imageUrl={
            mainArtistData.artistArt
              ? `data:image/jpeg;base64,${mainArtistData.artistArt}`
              : undefined
          }
        />

        {user.loggedIn ? (
          <div onClick={handleFavoriteClick} className="cursor-pointer mb-4">
            {artistFavorited ? (
              <HeartMinus className="size-5 hover:fill-pink-700 fill-pink-600" />
            ) : (
              <HeartPlus className="size-5 hover:fill-pink-700 fill-gray-400" />
            )}
          </div>
        ) : (
          <p className="italic">Log in to add this artist to your favorites</p>
        )}
        <section id="artist-biography">
          <p className="p-4 text-brand-mid italic">
            {mainArtistData.biography ?? "No biography available."}
          </p>
        </section>
        <hr />
      </div>
      <div className="mt-4">
        <div id="artist-tracks mt-4">
          <p className="text-ob-label tracking-label uppercase mb-2 text-ob-red">
            Tracks by {mainArtistData.name}
          </p>
          {mainArtistData.tracks && mainArtistData.tracks.length > 0 ? (
            <div className="mb-8">
              {mainArtistData.tracks.map((track) => (
                <TrackRow
                  key={track._id}
                  trackSlug={track.slug}
                  trackTitle={track.title}
                  artistSlug={mainArtistData.slug}
                  genre={track.genre}
                  imgUrl={track.trackArt ? `data:image/jpeg;base64,${track.trackArt}` : undefined}
                />
              ))}
            </div>
          ) : (
            <p>No tracks available.</p>
          )}
        </div>
        <hr />
        <div className="flex flex-col md:flex-row gap-8">
          <div id="artist-links" className="w-full md:w-1/2">
            <p className="text-ob-label tracking-label uppercase mb-2 text-ob-red">
              Find me on
            </p>
            <div>
              {mainArtistData.links &&
              Object.keys(mainArtistData.links).length > 0 ? (
                <ExternalLinkList
                  links={mainArtistData.links}
                  linkContainerType="cloud"
                  containerClasses="mb-4 mt-4"
                  title="Find me on"
                />
              ) : (
                <p>No links available.</p>
              )}
            </div>
          </div>
          <div id="artist-suggestions" className="mt-4 w-full md:w-1/2">
            <p className="text-ob-label tracking-label uppercase mb-2 text-ob-red">
              You might also like
            </p>
            <div className="gap-2 flex flex-col">
              <SimilarArtists
                similarArtistsData={similarArtistsData}
                similarArtistsError={similarArtistsError}
                isSimilarArtistsLoading={isSimilarArtistsLoading}
              />
              <OtherArtists
                otherArtistsData={otherArtistsData}
                otherArtistsError={otherArtistsError}
                isOtherArtistsLoading={isOtherArtistsLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
