import { Injectable, signal } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { MESSAGE } from '@/app/shared/constants/message';
import { Task, TASK_STATUS, TaskQuery } from '@/app/tasks/models/task.model';

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
      description: 'Реализовать простое ToDo приложение на Angular',
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

  public query = signal<TaskQuery>({});

  private applyQuery(): Task[] {
    const { filter, search, searchField } = this.query();

    return this.tasks().filter((task) => {
      let matchesSearch = true;
      let matchesFilter = true;

      if (search?.trim()) {
        const lowerCaseSearch = search.toLowerCase();
        if (searchField === 'title') {
          matchesSearch = task.title.toLowerCase().includes(lowerCaseSearch);
        } else if (searchField === 'description') {
          matchesSearch = !!task.description?.toLowerCase().includes(lowerCaseSearch);
        } else {
          matchesSearch =
            task.title.toLowerCase().includes(lowerCaseSearch) ||
            !!task.description?.toLowerCase().includes(lowerCaseSearch);
        }
      }

      if (filter) {
        matchesFilter = task.status === filter;
      }

      return matchesSearch && matchesFilter;
    });
  }

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
    return of(this.applyQuery());
  }

  public getTaskById(id: number): Observable<null | Task> {
    const task = this.tasks().find((t) => t.id === id);
    return of(task ?? null);
  }

  public resetQuery(): void {
    this.query.set({});
  }

  public updateTask(task: Task): Observable<Task> {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
    return of(task);
  }
}
