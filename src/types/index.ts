export type UserRole = "admin" | "member";
export type TaskStatus = "TODO" | "WIP" | "DONE" | "OVERDUE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserListOut {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_by: number;
  owner: UserListOut;
  created_at: string;
  updated_at: string | null;
  task_count: number;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  project_id: number;
  assigned_to: number | null;
  assignee: UserListOut | null;
  created_by: number;
  creator: UserListOut;
  created_at: string;
  updated_at: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  due_date: string;
  project_id: number;
  assigned_to?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assigned_to?: number;
}
