const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt?: string;
}

interface AuthResponse {
  user: User;
}

interface NotesResponse {
  notes: Note[];
}

interface Note {
  id: string;
  description: string;
  tags: string[];
  userId: string;
  created_at: string;
  updated_at: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  if (response.headers.get("Content-Type")?.includes("text/csv")) {
    return response.text() as Promise<T>;
  }

  return response.json();
}

export const authApi = {
  signup: (email: string, password: string, name?: string) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getMe: () => request<{ user: User }>("/auth/me"),

  getGithubAuthUrl: () => `${API_URL}/auth/github`,
};

export const notesApi = {
  getAll: () => request<NotesResponse>("/notes"),

  create: (description: string, tags?: string) =>
    request<{ note: Note }>("/notes", {
      method: "POST",
      body: JSON.stringify({ description, tags }),
    }),

  update: (id: string, description: string, tags?: string) =>
    request<{ note: Note }>(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ description, tags }),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/notes/${id}`, {
      method: "DELETE",
    }),

  exportCsv: () => request<string>("/notes/export"),
};

export type { User, Note };
