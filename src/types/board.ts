export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  priority: Priority;
  dueDate: string; // ISO string
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  columns: Column[];
}
