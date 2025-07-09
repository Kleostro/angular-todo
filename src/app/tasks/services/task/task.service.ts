import { Injectable, signal } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { MESSAGE } from '@/app/shared/constants/message';
import { Task } from '@/app/tasks/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([
    { description: 'Описание 1', id: 1, status: 'pending', title: 'Задача 1' },
    {
      description: 'Описание 2',
      id: 2,
      status: 'completed',
      title: 'Задача 2',
    },
    { description: 'Описание 3', id: 3, status: 'pending', title: 'Задача 3' },
  ]);

  public addTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => [task, ...tasks]);
    return of(task);
  }

  public deleteTask(task: Task): Observable<Task> {
    const candidateTask = this.tasks().find((t) => t.id === task.id);
    if (!candidateTask) {
      return throwError(() => new Error(MESSAGE.TASK_NOT_FOUND));
    }

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
