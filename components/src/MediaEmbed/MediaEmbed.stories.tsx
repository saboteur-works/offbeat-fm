import type { Meta, StoryObj } from "@storybook/react-vite";
import MediaEmbed from "./MediaEmbed";

const meta = {
  title: "Atoms/MediaEmbed",
  component: MediaEmbed,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof MediaEmbed>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const YouTubeVideo: Story = {
  args: {
    embedType: "video",
    mediaUrl: "https://www.youtube.com/embed/qHJVirD9VJE?si=IRs_y6ovUpOc2SGN",
    title: "YouTube video player",
  },
};

export const SpotifyAudio: Story = {
  args: {
    embedType: "audio",
    mediaUrl:
      "https://open.spotify.com/embed/track/0v9Q4A8TaHPy9YvdouNphf?utm_source=generator",
    title: "Spotify Audio",
  },
};

export const AppleMusicAudio: Story = {
  args: {
    embedType: "audio",
    mediaUrl:
      "https://embed.music.apple.com/us/song/the-horror-blood-red-flag/1801398762",
    title: "Apple Music Audio",
  },
};
