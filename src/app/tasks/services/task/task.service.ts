import { Injectable, signal } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { MESSAGE } from '@/app/shared/constants/message';
import { Task, TASK_STATUS } from '@/app/tasks/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([
    {
      description: 'Написать крутое сопроводительное письмо и ждать только положительный ответ( Это важно, правда :) )',
      id: 1,
      status: TASK_STATUS.COMPLETED,
      title: 'Оставить отклик на вакансию',
    },
    {
      description: 'Реализовать простое ToDo приложение на Agnular',
      id: 2,
      status: TASK_STATUS.COMPLETED,
      title: 'Выполнить тестовое задание',
    },
    {
      description: 'Рассказать о том какой ты крутой разработчик и если тебя возьмут, то не пожалеют об этом',
      id: 3,
      status: TASK_STATUS.PENDING,
      title: 'Пройти собеседование',
    },
  ]);

  public addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask = {
      ...task,
      id: this.tasks().length + 1,
    };

    this.tasks.update((tasks) => [newTask, ...tasks]);
    return of(newTask);
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

  public isTask(task: unknown): task is Task {
    return (
      typeof task === 'object' &&
      task !== null &&
      'id' in task &&
      'title' in task &&
      'status' in task &&
      'description' in task &&
      typeof task.id === 'number' &&
      typeof task.title === 'string' &&
      typeof task.status === 'string' &&
      (typeof task.description === 'string' || typeof task.description === 'undefined')
    );
  }

  public updateTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
    return of(task);
  }
}
