import type { Meta, StoryObj } from "@storybook/react-vite";
import UserFavoriteTrack from "./UserFavoriteTrack";

const meta = {
  title: "Atoms/UserFavoriteTrack",
  component: UserFavoriteTrack,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof UserFavoriteTrack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    trackTitle: "Foo",
    artistName: "Bar Baz",
    artistSlug: "bar-baz",
    trackSlug: "foo",
    genre: "Experimental",
    imgUrl: "https://picsum.photos/512?random=1",
    onClickDelete: () => alert("Delete clicked"),
  },
};
