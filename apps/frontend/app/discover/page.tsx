"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  DisplayTypography,
  ResourceTileList,
  TrackCard,
} from "@mda/components";

export default function Page() {
  const router = useRouter();

  const [tracks, setTracks] = useState([]);
  const fetchRandomTracks = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/tracks/random`,
    );
    setTracks(response.data.data);
  };
  useEffect(() => {
    fetchRandomTracks();
  }, []);

  return (
    <div className="flex flex-col md:flex-row grow py-2 px-4">
      <div className="grow md:px-4 py-2 md:overflow-y-auto">
        <header className="px-4 mb-4">
          <DisplayTypography text="Discover something you'll love." />
        </header>
        <div>
          <ResourceTileList
            resourceTiles={tracks.map((track) => (
              <TrackCard
                key={track._id}
                title={track.title}
                artist={track.artistName}
                imageUrl={track.trackArt}
                artistSlug={track.artistSlug}
                trackSlug={track.slug}
                // onClick={() =>
                //   router.push(`/track/${track.artistSlug}/${track.slug}`)
                // }
              />
            ))}
          />
          <div className="flex mt-4 justify-center">
            <Button
              label="Refresh"
              category="outline"
              onClick={() => {
                fetchRandomTracks();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
