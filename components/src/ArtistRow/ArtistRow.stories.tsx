import type { Meta, StoryObj } from "@storybook/react-vite";
import ArtistRow from "./ArtistRow";

const meta = {
  title: "Atoms/ArtistRow",
  component: ArtistRow,
  //   parameters: {
  //     layout: "centered",
  //   },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ArtistRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "Artist Name",
    genre: "Electronic",
    artistSlug: "artist-name",
  },
};
