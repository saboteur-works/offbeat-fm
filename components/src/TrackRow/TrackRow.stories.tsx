import type { Meta, StoryObj } from "@storybook/react-vite";
import TrackRow from "./TrackRow";

const meta = {
  title: "Atoms/TrackRow",
  component: TrackRow,

  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof TrackRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    trackTitle: "Believe",
    artistSlug: "the-bravery",
    trackSlug: "believe",
    genre: "Indie Rock",
    // imageUrl: "https://picsum.photos/512?random=1",
  },
};
