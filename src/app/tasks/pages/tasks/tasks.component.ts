import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { MESSAGE } from '@/app/shared/constants/message';
import { TaskListComponent } from '@/app/tasks/components/task-list/task-list.component';
import { Task } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

const snackBarConfig: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'left',
  verticalPosition: 'bottom',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent],
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  public readonly tasks = signal<Task[]>([]);

  private loadTasks(): Observable<Task[]> {
    return this.taskService.getAllTasks().pipe(
      takeUntil(this.destroy$),
      tap((tasks) => {
        this.tasks.set(tasks);
      }),
    );
  }

  public deleteTask(task: Task): void {
    this.taskService
      .deleteTask(task)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.snackBar.open(MESSAGE.DELETE_TASK_SUCCESS, 'Закрыть', snackBarConfig);
        }),
        switchMap(() => this.loadTasks()),
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
    this.loadTasks().subscribe();
  }
}
