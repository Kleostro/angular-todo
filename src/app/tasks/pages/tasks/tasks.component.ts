import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { MESSAGE } from '@/app/shared/constants/message';
import { TaskFormComponent } from '@/app/tasks/components/task-form/task-form.component';
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
  imports: [TaskListComponent, TaskFormComponent, MatButtonModule],
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly taskService = inject(TaskService);
  public readonly tasks = signal<Task[]>([]);
  public isShowTaskForm = signal(false);

  private handleTaskAction(action: Observable<Task>, successMessage: string): void {
    action
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.snackBar.open(successMessage, 'Закрыть', snackBarConfig);
        }),
        switchMap(() => this.loadTasks()),
        catchError((error: Error) => {
          this.snackBar.open(error.message, 'Закрыть', snackBarConfig);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private loadTasks(): Observable<Task[]> {
    return this.taskService.getAllTasks().pipe(
      takeUntil(this.destroy$),
      tap((tasks) => {
        this.tasks.set(tasks);
      }),
    );
  }

  public addTask(newTask: Omit<Task, 'id'>): void {
    this.handleTaskAction(this.taskService.addTask(newTask), MESSAGE.ADD_TASK_SUCCESS);
  }

  public deleteTask(task: Task): void {
    this.handleTaskAction(this.taskService.deleteTask(task), MESSAGE.DELETE_TASK_SUCCESS);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.loadTasks().subscribe();
  }
}
