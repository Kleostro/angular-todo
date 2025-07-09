export const TASK_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

export interface Task {
  description?: string;
  id: number;
  status: TaskStatus;
  title: string;
}

export interface TaskQuery {
  search?: string;
  searchField?: string;
}

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
