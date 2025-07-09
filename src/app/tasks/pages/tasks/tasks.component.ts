import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { TaskService } from '@/app/tasks/services/task/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly taskService = inject(TaskService);

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.taskService.getAllTasks().pipe(takeUntil(this.destroy$)).subscribe();
  }
}
