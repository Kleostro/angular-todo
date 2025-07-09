import { Routes } from '@angular/router';

import { APP_PATH } from '@/app/core/navigation/routes';

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
    title: `ToDo | ${APP_PATH.TASKS.slice(0, 1)} `,
  },
];

export default routes;
