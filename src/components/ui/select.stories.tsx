import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "@/components/ui/select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export const Default: Story = {
  args: {
    options,
    placeholder: "Select an option",
  },
};

export const WithValue: Story = {
  args: {
    options,
    value: "2",
    placeholder: "Select an option",
  },
};

export const Disabled: Story = {
  args: {
    options,
    disabled: true,
    placeholder: "Select an option",
  },
};
