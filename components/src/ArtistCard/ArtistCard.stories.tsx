import type { Meta, StoryObj } from "@storybook/react-vite";
import ArtistCard from "./ArtistCard";

const meta = {
  title: "Atoms/ArtistCard",
  component: ArtistCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ArtistCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "The Neon Circuit",
    meta: "Electronic, Synthwave",
    genre: "Electronic",
    imageUrl: "https://picsum.photos/512?random=1",
  },
};
