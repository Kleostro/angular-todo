import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Subject, takeUntil, tap } from 'rxjs';

import { TaskListComponent } from '@/app/tasks/components/task-list/task-list.component';
import { Task } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent],
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly taskService = inject(TaskService);
  public readonly tasks = signal<Task[]>([]);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.taskService
      .getAllTasks()
      .pipe(
        takeUntil(this.destroy$),
        tap((tasks) => {
          this.tasks.set(tasks);
        }),
      )
      .subscribe();
  }
}
