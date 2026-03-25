import type { Meta, StoryObj } from "@storybook/react-vite";
import BodyTypography from "./BodyTypography";

const meta = {
  title: "Typography/BodyTypography",
  component: BodyTypography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof BodyTypography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu scelerisque nunc. Aliquam erat volutpat. Donec malesuada vitae nibh vel dignissim. Etiam eu ligula et turpis bibendum suscipit. Fusce sit amet nibh mauris. Vestibulum pulvinar dignissim fringilla. Nulla facilisi.",
    weight: "normal",
  },
};

export const Bold: Story = {
  args: {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu scelerisque nunc. Aliquam erat volutpat. Donec malesuada vitae nibh vel dignissim. Etiam eu ligula et turpis bibendum suscipit. Fusce sit amet nibh mauris. Vestibulum pulvinar dignissim fringilla. Nulla facilisi.",
    weight: "bold",
  },
};
