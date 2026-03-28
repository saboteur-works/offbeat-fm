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

export default function TrackHeader({
  trackTitle,
  artistName,
  artistSlug,
  imgUrl,
  genre,
  duration,
  onClick,
}: TrackHeaderProps) {
  return (
    <div
      className={`flex gap-6 border-l-2 px-2.5 py-3.5 border-brand-red`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="w-[120px] h-[120px] bg-brand-surface2 border border-ob-dim shrink-0 flex items-center justify-center">
        {imgUrl && <img src={imgUrl} alt="Track Art" />}
      </div>
      <div>
        <p className="text-ob-display font-bold leading-tight">{trackTitle}</p>
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
