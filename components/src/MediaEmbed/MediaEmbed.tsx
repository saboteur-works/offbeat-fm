const mediaEmbedResolutions = {
  video: {
    w: "560",
    h: "315",
  },
  audio: {
    h: "150",
    w: "100%",
  },
};

interface MediaEmbedProps {
  embedType: "video" | "audio";
  mediaUrl: string;
  title: string;
}

export default function MediaEmbed({
  embedType = "video",
  title = "Embedded Media",
  mediaUrl,
}: MediaEmbedProps) {
  const resolution = mediaEmbedResolutions[embedType];
  const h = resolution.h;
  const w = resolution.w;

  return (
    <iframe
      title={title}
      data-testid="embed-iframe"
      src={mediaUrl}
      width={w}
      height={h}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
      loading="lazy"
    ></iframe>
  );
}
