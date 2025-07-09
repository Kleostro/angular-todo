import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';

import { TaskService } from '@/app/tasks/services/task/task.service';

const DEBOUNCE_TIME = 400;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule],
  selector: 'app-task-searching',
  styleUrl: './task-searching.component.scss',
  templateUrl: './task-searching.component.html',
})
export class TaskSearchingComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly taskService = inject(TaskService);
  public readonly searchFields = [
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
  ];
  public readonly searchForm = this.fb.group({
    search: [''],
    searchField: [this.searchFields[0].value],
  });

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap((formFalue) => {
          this.taskService.query.update((q) => ({
            ...q,
            search: formFalue.search,
            searchField: formFalue.searchField,
          }));
        }),
      )
      .subscribe();
  }
}
