import type { Meta, StoryObj } from "@storybook/react-vite";
import DisplayTypography from "./DisplayTypography";

const meta = {
  title: "Typography/DisplayTypography",
  component: DisplayTypography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof DisplayTypography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "Our mission is bold. So are you.",
  },
};
