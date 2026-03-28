import type { Meta, StoryObj } from "@storybook/react-vite";
import ArtistHeader from "./ArtistHeader";

const meta = {
  title: "Atoms/ArtistHeader",
  component: ArtistHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof ArtistHeader>;
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
