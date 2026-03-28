import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
interface UserFavoriteTrack {
  trackTitle: string;
  artistSlug: string;
  artistName: string;
  trackSlug: string;
  genre?: string;
  imgUrl?: string;
  onClickDelete?: () => void;
}

/**
 * TrackRow variation used for user favorite management
 */
export default function UserFavoriteTrack({
  trackTitle,
  artistName,
  artistSlug,
  trackSlug,
  imgUrl,
  genre,
  onClickDelete,
}: UserFavoriteTrack) {
  return (
    <div
      className={`flex gap-2.5 bg-brand-surface2 border-l-2 border-ob-border px-2.5 py-3.5 hover:border-brand-red`}
    >
      <div className="shrink-0 w-10 h-10 border-l-brand-red border border-ob-border bg-brand-dim">
        {imgUrl && <img src={imgUrl} alt="" />}
      </div>
      <div className="grow">
        <div className="leading-tight">{trackTitle}</div>
        <div className="flex items-center gap-2 text-brand-mid ">
          <span className="justify-end  text-technical uppercase">
            {artistName}
          </span>
          <span>·</span>
          <span className="justify-end  text-technical uppercase">{genre}</span>
        </div>
      </div>
      <div className="flex items-center gap-6 px-4">
        <Link href={`/track/${artistSlug}/${trackSlug}`}>
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
