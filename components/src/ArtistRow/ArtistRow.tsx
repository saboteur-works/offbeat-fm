import Link from "next/link";

interface ArtistRowProps {
  name: string;
  genre: string;
  artistSlug: string;
  avatarUrl?: string;
}

export default function ArtistRow({
  name,
  genre,
  artistSlug,
  avatarUrl,
}: ArtistRowProps) {
  return (
    <Link
      href={`/artists/${artistSlug}`}
      className="artist-row-item flex items-center gap-4 bg-brand-surface2 w-full shrink-0 p-2"
    >
      <div className="artist-row-avatar flex w-12 h-12 rounded-full bg-brand-surface items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full" />
        ) : (
          <span className="text-ob-dim font-mono">
            {name
              .split(" ")
              .map((part) => part.charAt(0))
              .join("")}
          </span>
        )}
      </div>
      <span className="artist-row-name font-sans grow">{name}</span>
      <span className="artist-row-genre text-technical uppercase">{genre}</span>
    </Link>
  );
}
