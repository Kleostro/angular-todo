import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTE } from '@/app/core/navigation/routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  public goBack(): void {
    this.location.back();
  }

  public navigateToTaskById(taskId: number): void {
    this.router.navigate([APP_ROUTE.TASKS, taskId]);
  }
}
