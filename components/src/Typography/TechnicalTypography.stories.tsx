import type { Meta, StoryObj } from "@storybook/react-vite";
import TechnicalTypography from "./TechnicalTypography";

const meta = {
  title: "Typography/TechnicalTypography",
  component: TechnicalTypography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof TechnicalTypography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "Artists, albums, genres, and more",
  },
};

export const Red: Story = {
  args: {
    text: "Artists, albums, genres, and more",
    isRed: true,
  },
};

export const Uppercase: Story = {
  args: {
    text: "Artists, albums, genres, and more",
    uppercase: true,
  },
};
