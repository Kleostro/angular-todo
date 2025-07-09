import { Routes } from '@angular/router';

import { APP_PATH } from '@/app/core/navigation/routes';
import { taskResolver } from '@/app/tasks/resolvers/task.resolver';

export const routes: Routes = [
  {
    path: APP_PATH.DEFAULT,
    pathMatch: 'full',
    redirectTo: APP_PATH.TASKS.toLowerCase(),
  },
  {
    loadComponent: () => import('./tasks/pages/tasks/tasks.component').then((c) => c.TasksComponent),
    path: APP_PATH.TASKS.toLowerCase(),
    title: `ToDo | ${APP_PATH.TASKS} `,
  },
  {
    loadComponent: () => import('./tasks/pages/task/task.component').then((c) => c.TaskComponent),
    path: `${APP_PATH.TASKS.toLowerCase()}/:id`,
    resolve: { task: taskResolver },
    title: `ToDo | ${APP_PATH.TASKS.slice(0, 1)} `,
  },
  {
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    path: APP_PATH.NOT_FOUND,
    title: `ToDo | ${APP_PATH.NOT_FOUND}`,
  },
  {
    path: APP_PATH.NO_MATCH,
    redirectTo: APP_PATH.NOT_FOUND,
  },
];

export default routes;
