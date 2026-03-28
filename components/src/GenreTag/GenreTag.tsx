interface GenreTagProps {
  genre: string;
  primary?: boolean;
}

export default function GenreTag({ genre, primary }: GenreTagProps) {
  return (
    <div
      className={`genre-tag ${primary ? "text-brand-red border-brand-red" : ""}`}
    >
      <p className="genre-name">{genre}</p>
    </div>
  );
}
