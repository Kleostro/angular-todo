import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';

import { catchError, EMPTY, Subject, takeUntil, tap } from 'rxjs';

import { NavigationService } from '@/app/core/navigation/navigation.service';
import { MESSAGE } from '@/app/shared/constants/message';
import { TaskItemComponent } from '@/app/tasks/components/task-item/task-item.component';
import { isTask } from '@/app/tasks/helpers/isTask';
import { Task, TASK_STATUS } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

const snackBarConfig: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'left',
  verticalPosition: 'bottom',
};

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
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  public readonly navigationService = inject(NavigationService);
  public currentTask = signal<null | Task>(null);

  public deleteTask(task: Task): void {
    this.taskService
      .deleteTask(task)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.snackBar.open(MESSAGE.DELETE_TASK_SUCCESS, 'Закрыть', snackBarConfig);
          this.navigationService.navigateToTasks();
        }),
        catchError((error: Error) => {
          this.snackBar.open(error.message, 'Закрыть', snackBarConfig);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        tap(({ task }) => {
          if (isTask(task)) {
            this.currentTask.set(task);
          }
        }),
      )
      .subscribe();
  }

  public switchTaskStatus(task: Task): void {
    const updatedTask = {
      ...task,
      status: task.status === TASK_STATUS.PENDING ? TASK_STATUS.COMPLETED : TASK_STATUS.PENDING,
    };
    this.taskService
      .updateTask(updatedTask)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.snackBar.open(MESSAGE.SWITCH_TASK_STATUS_SUCCESS, 'Закрыть', snackBarConfig);
          this.currentTask.set(updatedTask);
        }),
        catchError((error: Error) => {
          this.snackBar.open(error.message, 'Закрыть', snackBarConfig);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
