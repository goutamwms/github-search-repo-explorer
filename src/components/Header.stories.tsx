import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
