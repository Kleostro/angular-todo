import { Task } from '@/app/tasks/models/task.model';

export const isTask = (task: unknown): task is Task =>
  typeof task === 'object' &&
  task !== null &&
  'id' in task &&
  'title' in task &&
  'status' in task &&
  'description' in task &&
  typeof task.id === 'number' &&
  typeof task.title === 'string' &&
  typeof task.status === 'string' &&
  (typeof task.description === 'string' || typeof task.description === 'undefined');
