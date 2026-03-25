"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ResourceTile, ResourceTileList } from "@mda/components";
import { unbounded } from "@/fonts";

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
      <div className="flex-grow md:px-4 py-2 md:overflow-y-auto">
        <header className="px-4">
          <h1
            className={`text-xl font-bold md:text-3xl mb-2 text-center ${unbounded.className}`}
          >
            Discover something you'll love
          </h1>
        </header>
        <div>
          <ResourceTileList
            resourceTiles={tracks.map((track) => (
              <ResourceTile
                key={track._id}
                mainText={track.title}
                subText={track.artistName}
                imageUrl={track.trackArt}
                onClick={() =>
                  router.push(`/track/${track.artistSlug}/${track.slug}`)
                }
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
