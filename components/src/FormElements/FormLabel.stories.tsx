import type { Meta, StoryObj } from "@storybook/react-vite";
import FormLabel from "./FormLabel";

const meta = {
  title: "FormElements/FormLabel",
  component: FormLabel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof FormLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    id: "username-label",
    children: (
      <input
        id="username-input"
        type="text"
        placeholder="Username"
        className="border p-2 rounded"
      />
    ),
    htmlFor: "username-input",
  },
};
