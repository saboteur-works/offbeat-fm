import Link from "next/link";

interface TrackCardProps {
  title?: string;
  artist?: string;
  genre?: string;
  imageUrl?: string;
  artistSlug?: string;
  trackSlug?: string;
}

export default function TrackCard({
  title,
  artist,
  genre,
  imageUrl,
  artistSlug,
  trackSlug,
}: TrackCardProps) {
  return (
    <div className="track-card mb-4">
      <div className="track-art">
        {imageUrl && (
          <>
            <img src={imageUrl} alt={`${title} Album Art`} />
            <div className="art-accent" />
            <span className="art-label">{genre ?? "--"}</span>
          </>
        )}
      </div>
      {artistSlug && trackSlug ? (
        <Link
          href={`/track/${artistSlug}/${trackSlug}`}
          className="track-title"
        >
          {title ?? ""}
        </Link>
      ) : (
        <p className="track-title">{title ?? ""}</p>
      )}

      {artistSlug ? (
        <Link href={`/artists/${artistSlug}`} className="artist-name">
          {artist ?? ""}
        </Link>
      ) : (
        <p className="artist-name">{artist ?? ""}</p>
      )}
    </div>
  );
}
