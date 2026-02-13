import { JSX } from "react";

interface MediaEmbedListProps {
  mediaEmbeds: JSX.Element[];
}

export default function MediaEmbedList({ mediaEmbeds }: MediaEmbedListProps) {
  return (
    <div>
      {mediaEmbeds.map((Embed, index) => (
        <div key={index} className="mb-4">
          {Embed}
        </div>
      ))}
    </div>
  );
}
