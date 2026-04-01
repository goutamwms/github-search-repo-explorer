import type { Meta, StoryObj } from "@storybook/react";
import { RepositoryCard } from "@/components/RepositoryCard";
import type { GitHubRepository } from "@/types/github";

const meta = {
  title: "Components/RepositoryCard",
  component: RepositoryCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RepositoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockRepository: GitHubRepository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  description: "React is a JavaScript library for building user interfaces.",
  html_url: "https://github.com/facebook/react",
  stargazers_count: 215000,
  forks_count: 46000,
  language: "JavaScript",
  updated_at: "2024-01-15T10:30:00Z",
  topics: ["react", "javascript", "ui", "frontend"],
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
};

export const Default: Story = {
  args: {
    repository: mockRepository,
  },
};

export const NoDescription: Story = {
  args: {
    repository: {
      ...mockRepository,
      description: null,
    },
  },
};

export const ManyTopics: Story = {
  args: {
    repository: {
      ...mockRepository,
      topics: [
        "react",
        "javascript",
        "typescript",
        "ui",
        "virtual-dom",
        "frontend",
        "library",
      ],
    },
  },
};

export const NoLanguage: Story = {
  args: {
    repository: {
      ...mockRepository,
      language: null,
    },
  },
};
