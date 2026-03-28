import { ArtistRow } from "@mda/components";
import { useRouter } from "next/navigation";
interface OtherArtistsProps {
  otherArtistsData?: any;
  otherArtistsError?: any;
  isOtherArtistsLoading?: boolean;
}

export default function OtherArtists({
  otherArtistsData,
  otherArtistsError,
  isOtherArtistsLoading,
}: OtherArtistsProps) {
  const router = useRouter();
  if (isOtherArtistsLoading) {
    return <div>Loading...</div>;
  }
  if (otherArtistsError) {
    return <div>Error: {otherArtistsError.message}</div>;
  }
  return (
    <div id="other-suggestions">
      {/* <h2 className="text-xl font-semibold mt-4">Other Artists</h2> */}
      {otherArtistsData && otherArtistsData.length > 0 && (
        <div className="flex flex-col gap-2">
          {otherArtistsData.map((artist) => (
            // <SidebarButton
            //   label={artist.name}
            //   key={`other-artist-${artist.slug}`}
            //   textAlign="left"
            //   onClick={() => router.push(`/artists/${artist.slug}`)}
            // />
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
      )}
    </div>
  );
}
