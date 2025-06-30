interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    }
  }

  // Auth endpoints
  async login(identifier: string, password: string) {
    const result = await this.request<{ user: User; access_token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      }
    );
    if (result.data?.access_token) {
      this.setToken(result.data.access_token);
    }
    return result;
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const result = await this.request<{
      user: User;
      access_token: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
      }),
    });
    const token = result.data?.access_token;
    if (token) {
      this.setToken(token);
    }
    return result;
  }

  async getProfile() {
    return this.request<User>("/users/profile");
  }

  // Teams endpoints
  async getTeams() {
    return this.request<Team[]>("/teams");
  }

  async createTeam(name: string, description?: string) {
    return this.request<Team>("/teams", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  async getTeam(teamId: string) {
    return this.request<Team>(`/teams/${teamId}`);
  }

  async inviteMember(teamId: string, identifier: string) {
    return this.request<{ message: string }>(`/teams/${teamId}/members`, {
      method: "POST",
      body: JSON.stringify({ identifier }),
    });
  }

  async getTeamMembers(teamId: string) {
    return this.request<TeamMember[]>(`/teams/${teamId}/members`);
  }

  // Tasks endpoints
  async getTasks(teamId: string) {
    return this.request<Task[]>(`/teams/${teamId}/tasks`);
  }

  async createTask(teamId: string, task: CreateTaskData) {
    return this.request<Task>(`/teams/${teamId}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  async updateTask(teamId: string, taskId: string, updates: Partial<Task>) {
    return this.request<Task>(`/teams/${teamId}/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(teamId: string, taskId: string) {
    return this.request<{ message: string }>(
      `/teams/${teamId}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );
  }
}

export const apiClient = new ApiClient();

// Types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members?: TeamMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: "Admin" | "Member";
  joinedAt: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  teamId: string;
  createdBy: User | null;
  assignedToId?: User | null;
  createdAt: string;
  updatedAt: string;
  creator: User;
}

export interface CreateTaskData {
  title: string;
  description: string;
  assignedToId?: string;
}
