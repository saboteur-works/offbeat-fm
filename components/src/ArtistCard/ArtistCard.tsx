interface ArtistCardProps {
  name: string;
  meta: string;
  genre: string;
  imageUrl: string;
}

/**
 * A card component that displays an artist's name, meta information,
 * genre, and image. The component is designed to be reusable and can
 * be used to showcase different artists by passing the appropriate props.
 * The image is displayed in a square aspect ratio, and if no image URL is
 * provided, a placeholder is shown instead.
 */
export default function ArtistCard({
  name,
  meta,
  genre,
  imageUrl,
}: ArtistCardProps) {
  return (
    <div className="artist-card mb-4">
      {/* <img src={imageUrl} alt={name} className="artist-image" /> */}
      <div className="artist-image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full aspect-square" />
        ) : (
          <span className="image-placeholder">Image</span>
        )}
      </div>
      <div className="artist-info">
        <h3 className="artist-name">{name}</h3>
        <p className="artist-meta">{meta}</p>
        <div className="artist-tags">
          <span className="genre-tag">{genre}</span>
        </div>
      </div>
    </div>
  );
}
