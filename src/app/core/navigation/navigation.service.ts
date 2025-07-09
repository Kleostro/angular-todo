import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs';

import { APP_ROUTE } from '@/app/core/navigation/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public isDetailedTaskPage = signal(false);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const { url } = this.router;

      this.isDetailedTaskPage.set(url.startsWith(APP_ROUTE.TASKS + '/'));
    });
  }

  public goBack(): void {
    this.location.back();
  }

  public navigateToNotFound(): void {
    this.router.navigate([APP_ROUTE.NOT_FOUND]);
  }

  public navigateToTaskById(taskId: number): void {
    this.router.navigate([APP_ROUTE.TASKS, taskId]);
  }
}
