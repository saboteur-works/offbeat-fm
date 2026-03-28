import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

interface UserFavoriteArtistProps {
  name: string;
  genre: string;
  artistSlug: string;
  totalTracks?: number;
  avatarUrl?: string;
  onClickDelete?: () => void;
}

export default function UserFavoriteArtist({
  name,
  genre,
  artistSlug,
  avatarUrl,
  onClickDelete,
}: UserFavoriteArtistProps) {
  return (
    <div className="artist-row-item flex items-center gap-4 bg-brand-surface2 w-full shrink-0 p-2 border-l-2 border-ob-border hover:border-brand-red">
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
      <div className="grow">
        <div className="artist-row-name font-sans grow">{name}</div>
        <div className="artist-row-genre text-technical uppercase">{genre}</div>
      </div>
      <div className="flex items-center gap-6 px-4">
        <Link href={`/artists/${artistSlug}`}>
          <Eye className="size-5 text-brand-mid cursor-pointer hover:text-brand-white" />
        </Link>
        <button type="button" onClick={onClickDelete}>
          <Trash2
            className="size-5 text-brand-mid cursor-pointer hover:text-brand-red"
            onClick={onClickDelete}
          />
        </button>
      </div>
    </div>
  );
}
