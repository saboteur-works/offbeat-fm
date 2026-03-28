import type { Meta, StoryObj } from "@storybook/react-vite";
import IconLink from "./IconLink";
import { Icon } from "../Icons/Icons";
const meta = {
  title: "Atoms/IconLink",
  component: IconLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof IconLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: "https://www.example.com",
    icon: <Icon icon="Spotify" size="small" />, // Assuming you have a Spotify icon in your Icon component
    label: "Spotify",
  },
};
