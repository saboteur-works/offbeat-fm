import Link from "next/link";

interface TrackHeaderProps {
  trackTitle: string;
  artistName?: string;
  artistSlug?: string;
  genre?: string;
  imgUrl?: string;
  duration?: string;
  onClick?: () => void;
}

/**
 * TrackHeader component displays the track's title, artist name (with a link to the artist's page),
 * genre, and duration. It also includes an image for the track if provided. The entire header is
 * clickable, triggering the onClick function if it exists.
 */
export default function TrackHeader({
  trackTitle,
  artistName,
  artistSlug,
  imgUrl,
  genre,
  duration,
}: TrackHeaderProps) {
  return (
    <div className={`flex gap-6 border-l-2 px-2.5 py-3.5 border-brand-red`}>
      <div className="w-[120px] h-[120px] bg-brand-surface2 border border-ob-dim shrink-0 flex items-center justify-center">
        {imgUrl && <img src={imgUrl} alt="Track Art" />}
      </div>
      <div>
        <p className="text-ob-h2 font-bold md:text-ob-display  leading-tight">
          {trackTitle}
        </p>
        <Link
          href={`/artists/${artistSlug}`}
          className="font-mono text-brand-mid"
        >
          {artistName}
        </Link>
        <div className="flex gap-4">
          {/* Genre, Date added, Status (Da + Status need to be implemented) */}
          <div>
            <p className="text-ob-label uppercase text-ob-dim">Genre</p>
            <p className="font-mono text-brand-mid">{genre}</p>
          </div>
          <div>
            <p className="text-ob-label uppercase text-ob-dim">Track Length</p>
            <p className="font-mono text-brand-mid">{duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
