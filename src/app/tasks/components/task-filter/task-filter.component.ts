import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';

import { TASK_STATUS } from '@/app/tasks/models/task.model';
import { TaskService } from '@/app/tasks/services/task/task.service';

const DEBOUNCE_TIME = 400;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatRadioModule],
  selector: 'app-task-filter',
  styleUrl: './task-filter.component.scss',
  templateUrl: './task-filter.component.html',
})
export class TaskFilterComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly taskService = inject(TaskService);
  public readonly filterFields = [
    { label: 'Все', value: '' },
    { label: 'В процессе', value: TASK_STATUS.PENDING },
    { label: 'Выполнено', value: TASK_STATUS.COMPLETED },
  ];
  public readonly filterForm = this.fb.group({
    filter: [''],
  });

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formFalue) => {
          this.taskService.query.update((q) => ({
            ...q,
            filter: formFalue.filter,
          }));
        }),
      )
      .subscribe();
  }
}
