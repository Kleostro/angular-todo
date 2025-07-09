export const APP_PATH = {
  DEFAULT: '',
  NO_MATCH: '**',
  NOT_FOUND: '404',
  TASKS: 'Tasks',
} as const;

export const APP_ROUTE = {
  HOME: '/',
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  TASKS: `/${APP_PATH.TASKS.toLowerCase()}`,
} as const;
