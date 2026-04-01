import type { Meta, StoryObj } from "@storybook/react";
import { Loader, PageLoader } from "@/components/ui/loader";

const meta = {
  title: "UI/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Page: Story = {
  render: () => <PageLoader />,
};
