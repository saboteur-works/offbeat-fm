import { IArtist } from "@common/types/src/types";
import { ArtistRow } from "@mda/components";
import { useRouter } from "next/navigation";
interface SimilarArtistsProps {
  similarArtistsData?: IArtist[];
  similarArtistsError?: any;
  isSimilarArtistsLoading?: boolean;
}

export default function SimilarArtists({
  similarArtistsData,
  similarArtistsError,
  isSimilarArtistsLoading,
}: SimilarArtistsProps) {
  const router = useRouter();
  if (isSimilarArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (similarArtistsError) {
    return <div>Error: {similarArtistsError.message}</div>;
  }
  return (
    <div id="suggestions">
      {similarArtistsData.length > 0 ? (
        <div className="flex flex-col gap-2">
          {/* {similarArtistsData.map((artist) => (
            <SidebarButton
              label={artist.name}
              key={artist.slug}
              textAlign="left"
              onClick={() => router.push(`/artists/${artist.slug}`)}
            />
          ))} */}
          {similarArtistsData.map((artist) => (
            <ArtistRow
              key={artist.slug}
              avatarUrl={artist.artistArt ? `data:image/jpeg;base64,${artist.artistArt}` : undefined}
              name={artist.name}
              genre={artist.genre}
              artistSlug={artist.slug}
              // onClick={() => router.push(`/artists/${artist.slug}`)}
            />
          ))}
        </div>
      ) : (
        <p>No similar artists found (yet)</p>
      )}
    </div>
  );
}
