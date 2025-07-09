export interface Task {
  description?: string;
  id: number;
  status: 'completed' | 'pending';
  title: string;
}
