import Link from "next/link";

interface TrackRowProps {
  trackTitle: string;
  artistSlug: string;
  trackSlug: string;
  genre?: string;
  imgUrl?: string;
  width?: "full" | "quarter" | "half" | "auto";
}

export default function TrackRow({
  trackTitle,
  artistSlug,
  trackSlug,
  imgUrl,
  genre,
  width = "full",
}: TrackRowProps) {
  const widthMap = {
    full: "w-full",
    quarter: "w-1/4",
    half: "w-1/2",
    auto: "w-auto",
  };

  return (
    <Link
      href={`/track/${artistSlug}/${trackSlug}`}
      className={`track-row ${widthMap[width]} flex gap-2.5 items-center bg-brand-surface2 border-l-2 border-ob-border px-2.5 py-3.5 hover:border-brand-red cursor-pointer`}
    >
      <div className="track-row-image shrink-0 w-10 h-10 border-l-brand-red border border-ob-border bg-brand-dim">
        {imgUrl && <img src={imgUrl} alt="Track Art" />}
      </div>
      <span className="track-row-title grow">{trackTitle}</span>
      <span className="track-row-genre justify-end  text-technical uppercase">
        {genre}
      </span>
    </Link>
  );
}
