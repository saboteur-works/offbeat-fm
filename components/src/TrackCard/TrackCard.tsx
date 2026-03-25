interface TrackCardProps {
  title?: string;
  artist?: string;
  genre?: string;
  imageUrl?: string;
}

export default function TrackCard({
  title,
  artist,
  genre,
  imageUrl,
}: TrackCardProps) {
  return (
    <div className="track-card">
      <div className="track-art">
        {imageUrl && (
          <>
            <img src={imageUrl} alt={`${title} Album Art`} />
            <div className="art-accent" />
            <span className="art-label">{genre ?? "--"}</span>
          </>
        )}
      </div>
      {}
      <p className="track-title">{title ?? ""}</p>
      <p className="track-artist">{artist ?? "--"}</p>
    </div>
  );
}
