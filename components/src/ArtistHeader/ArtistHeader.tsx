interface ArtistHeaderProps {
  name: string;
  meta: string;
  genre: string;
  imageUrl: string;
  totalTracks?: number;
}

/**
 * A card component that displays an artist's name, meta information,
 * genre, and image. The component is designed to be reusable and can
 * be used to showcase different artists by passing the appropriate props.
 * The image is displayed in a square aspect ratio, and if no image URL is
 * provided, a placeholder is shown instead.
 */
export default function ArtistHeader({
  name,
  meta,
  genre,
  imageUrl,
  totalTracks,
}: ArtistHeaderProps) {
  return (
    <div className="artist-header mb-4">
      <div className="artist-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full aspect-square" />
        ) : (
          <span className="image-placeholder text-ob-dim">No Image</span>
        )}
      </div>
      <div className="artist-info">
        <h1 className="artist-name">{name}</h1>
        {totalTracks !== undefined && (
          <p className="artist-meta">{totalTracks} Tracks</p>
        )}
        <div className="artist-tags">
          <span className="genre-tag uppercase">{genre}</span>
        </div>
      </div>
    </div>
  );
}
