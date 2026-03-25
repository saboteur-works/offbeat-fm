"use client";
import { useRouter } from "next/navigation";

import { use, useEffect, useState } from "react";
import getArtistById from "../../../../actions/getArtistDataById";
import getTracksByArtist from "../../../../actions/getTracksByArtist";
import { Button } from "@mda/components";
import EditArtistForm from "./EditArtistForm";
import deleteTrack from "../../../../actions/deleteTrack";
import useAuth from "../../../../swrHooks/useAuth";
import AccessUnauthorized from "../../../../commonComponents/AccessUnauthorized";
import axiosInstance from "../../../../util/axiosInstance";
import toast from "react-hot-toast";

export default function Page({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { authenticatedUser, isLoading, error } = useAuth();
  const router = useRouter();
  const artistId = use(params).artistId;
  const [artistData, setArtistData] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);
  const [editArtistData, setEditArtistData] = useState(false);
  const [prepareDeleteArtist, setPrepareDeleteArtist] = useState(false);
  useEffect(() => {
    getArtistById(artistId, true).then((data) => setArtistData(data));
    getTracksByArtist(artistId).then((data) => setArtistTracks(data.data));
  }, []);
  const handleDeleteTrack = async (trackId: string) => {
    const response = await deleteTrack(trackId);
    if (response.status === 200) {
      setArtistTracks((prevTracks) =>
        prevTracks.filter((track) => track._id !== trackId),
      );
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <AccessUnauthorized />;
  }
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
      {artistData ? (
        <div>
          <div id="artist-details" className="mb-4">
            <h2 className="text-xl font-semibold">{artistData.name}</h2>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              label="Go to Artist Page"
              category="outline"
              onClick={() => router.push(`/artists/${artistData.slug}`)}
            />
            {!editArtistData && (
              <Button
                label="Edit Artist Details"
                category="outline"
                onClick={() => setEditArtistData(true)}
              />
            )}
            <Button
              label="Delete Artist Profile"
              category="destructive"
              onClick={() => setPrepareDeleteArtist(true)}
            />
          </div>
          <div id="delete-artist-confirmation" className="my-4">
            {prepareDeleteArtist && (
              <div className="border border-red-600 p-4 rounded-md ">
                <p className="text-red-700 mb-2">
                  Are you sure you want to delete this artist profile? This
                  action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <Button
                    label="Confirm Delete"
                    category="destructive"
                    onClick={async () => {
                      // Call delete artist action
                      const response = await axiosInstance.delete(
                        `artists/${artistId}`,
                      );
                      if (response.status === 200) {
                        toast.success("Artist profile deleted successfully");
                        router.push("/artist/dashboard");
                      } else {
                        toast.error("Error deleting artist profile");
                      }
                    }}
                  />
                  <Button
                    label="Cancel"
                    category="outline"
                    onClick={() => setPrepareDeleteArtist(false)}
                  />
                </div>
              </div>
            )}
          </div>
          {editArtistData && (
            <EditArtistForm
              artistId={artistId}
              artistData={artistData}
              setArtistDataAction={setArtistData}
              setEditArtistDataAction={setEditArtistData}
            />
          )}
          <div id="artist-tracks" className="mt-4">
            <p className="text-xl font-semibold mb-4">Artist Tracks</p>
            <Button
              label="Add New Track"
              onClick={() =>
                router.push(`/artist/dashboard/${artistId}/add-track`)
              }
              category="primary"
            />
            {artistTracks.length > 0 ? (
              <div className="flex flex-col w-full mt-4 rounded-md">
                {artistTracks.map((track) => (
                  <div
                    key={track._id}
                    className="flex p-2 my-2 w-full items-center border border-gray-500 hover:bg-gray-900 rounded-md transition-colors"
                  >
                    {track.title}
                    <div className="grow" />
                    <div className="space-x-4">
                      <Button
                        label="Edit"
                        category="outline"
                        onClick={() =>
                          router.push(
                            `/artist/dashboard/${artistId}/edit-track/${track._id}`,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tracks found for this artist.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading artist data...</p>
      )}
    </div>
  );
}
