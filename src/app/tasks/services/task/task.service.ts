import { Injectable, signal } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Task } from '@/app/tasks/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([
    { description: 'Description 1', id: 1, status: 'pending', title: 'Task 1' },
    {
      description: 'Description 2',
      id: 2,
      status: 'completed',
      title: 'Task 2',
    },
    { description: 'Description 3', id: 3, status: 'pending', title: 'Task 3' },
    { description: 'Description 4', id: 4, status: 'pending', title: 'Task 4' },
  ]);

  public addTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => [task, ...tasks]);
    return of(task);
  }

  public deleteTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
    return of(task);
  }

  public getAllTasks(): Observable<Task[]> {
    return of(this.tasks());
  }

  public getTaskById(id: number): Observable<null | Task> {
    const task = this.tasks().find((t) => t.id === id);
    return of(task ?? null);
  }

  public updateTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
    return of(task);
  }
}
