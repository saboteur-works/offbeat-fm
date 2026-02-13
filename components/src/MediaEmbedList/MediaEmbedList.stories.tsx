import type { Meta, StoryObj } from "@storybook/react-vite";
import MediaEmbedList from "./MediaEmbedList";
import MediaEmbed from "../MediaEmbed/MediaEmbed";

const meta = {
  title: "Atoms/MediaEmbedList",
  component: MediaEmbedList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof MediaEmbedList>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    mediaEmbeds: [
      <MediaEmbed
        embedType="video"
        mediaUrl="https://www.youtube.com/embed/qHJVirD9VJE?si=IRs_y6ovUpOc2SGN"
        title="YouTube video player"
      />,
      <MediaEmbed
        embedType="audio"
        mediaUrl="https://embed.music.apple.com/us/song/the-horror-blood-red-flag/1801398762"
        title="Apple Music audio player"
      />,
      <MediaEmbed
        embedType="audio"
        mediaUrl="https://open.spotify.com/embed/track/0v9Q4A8TaHPy9YvdouNphf?utm_source=generator"
        title="Spotify audio player"
      />,
    ],
  },
};
