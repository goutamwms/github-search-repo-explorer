import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "@/components/Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalItems: 100,
    currentPage: 1,
    perPage: 10,
    onPageChange: (page) => console.log("Page:", page),
    onPerPageChange: (perPage) => console.log("Per page:", perPage),
  },
};

export const Page5: Story = {
  args: {
    totalItems: 100,
    currentPage: 5,
    perPage: 10,
    onPageChange: (page) => console.log("Page:", page),
    onPerPageChange: (perPage) => console.log("Per page:", perPage),
  },
};

export const ManyItems: Story = {
  args: {
    totalItems: 500,
    currentPage: 10,
    perPage: 30,
    onPageChange: (page) => console.log("Page:", page),
    onPerPageChange: (perPage) => console.log("Per page:", perPage),
  },
};
