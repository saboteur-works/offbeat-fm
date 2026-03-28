import type { Meta, StoryObj } from "@storybook/react-vite";
import TrackCard from "./TrackCard";

const meta = {
  title: "Atoms/TrackCard",
  component: TrackCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof TrackCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "Believe",
    artist: "The Neon Circuit",
    genre: "Electronic",
    imageUrl: "https://picsum.photos/512?random=1",
  },
};

export const Placeholder: Story = {
  args: {},
};
