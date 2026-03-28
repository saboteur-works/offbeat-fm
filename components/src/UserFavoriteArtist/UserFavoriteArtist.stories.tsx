import type { Meta, StoryObj } from "@storybook/react-vite";
import UserFavoriteArtist from "./UserFavoriteArtist";

const meta = {
  title: "Atoms/UserFavoriteArtist",
  component: UserFavoriteArtist,

  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof UserFavoriteArtist>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "The Bravery",
    artistSlug: "the-bravery",
    genre: "Indie Rock",
    totalTracks: 42,
    // imageUrl: "https://picsum.photos/512?random=1",
  },
};
