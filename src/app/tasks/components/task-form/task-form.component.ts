import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task, TASK_STATUS } from '@/app/tasks/models/task.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, MatButtonModule],
  selector: 'app-task-form',
  styleUrl: './task-form.component.scss',
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder);
  public readonly form = this.fb.nonNullable.group({
    description: [''],
    title: ['', [Validators.required]],
  });

  public formSubmitEvent = output<Omit<Task, 'id'>>();

  public resetForm(): void {
    this.form.reset();
  }

  public submitForm(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.valid) {
      this.formSubmitEvent.emit({ ...this.form.getRawValue(), status: TASK_STATUS.PENDING });
    }
  }
}
