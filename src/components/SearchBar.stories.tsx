import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "@/components/SearchBar";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (query, sort, order) => console.log({ query, sort, order }),
  },
};

export const Loading: Story = {
  args: {
    onSearch: () => {},
    isLoading: true,
  },
};
