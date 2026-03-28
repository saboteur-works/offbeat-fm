import type { Meta, StoryObj } from "@storybook/react-vite";
import GenreTag from "./GenreTag";

const meta = {
  title: "Atoms/GenreTag",
  component: GenreTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof GenreTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    genre: "Electronic",
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    genre: "Electronic",
  },
};
