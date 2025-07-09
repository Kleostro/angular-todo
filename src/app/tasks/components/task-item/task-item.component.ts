import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '@/app/tasks/models/task.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  selector: 'app-task-item',
  styleUrl: './task-item.component.scss',
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  public task = input<null | Task>();
}
