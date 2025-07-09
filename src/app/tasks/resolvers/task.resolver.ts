import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn } from '@angular/router';

import { of, tap } from 'rxjs';

import { NavigationService } from '@/app/core/navigation/navigation.service';
import { Task } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

export const taskResolver: ResolveFn<null | Task> = (route) => {
  const taskService = inject(TaskService);
  const navigationService = inject(NavigationService);
  const title = inject(Title);
  const { id } = route.params;
  if (typeof id === 'string') {
    return taskService.getTaskById(+id).pipe(
      tap((task) => {
        if (!task) {
          navigationService.navigateToNotFound();
        } else {
          title.setTitle('ToDo | ' + task.title);
        }
      }),
    );
  }
  return of(null);
};
