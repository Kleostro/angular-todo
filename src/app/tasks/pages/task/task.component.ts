import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';

import { NavigationService } from '@/app/core/navigation/navigation.service';
import { TaskItemComponent } from '@/app/tasks/components/task-item/task-item.component';
import { Task } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskItemComponent, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'app-task',
  styleUrl: './task.component.scss',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  public readonly navigationService = inject(NavigationService);
  public currentTask = signal<null | Task>(null);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        tap(({ task }) => {
          if (this.taskService.isTask(task)) {
            this.currentTask.set(task);
          }
        }),
      )
      .subscribe();
  }
}
