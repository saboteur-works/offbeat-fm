import type { Meta, StoryObj } from "@storybook/react-vite";
import TrackHeader from "./TrackHeader";

const meta = {
  title: "Atoms/TrackHeader",
  component: TrackHeader,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof TrackHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    trackTitle: "Believe",
    artistName: "The Neon Circuit",
    genre: "Electronic",
    duration: "03:45",
    imgUrl: "https://picsum.photos/512?random=1",
  },
};
