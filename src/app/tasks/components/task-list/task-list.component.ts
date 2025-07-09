import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { TaskItemComponent } from '@/app/tasks/components/task-item/task-item.component';
import { Task } from '@/app/tasks/models/task.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskItemComponent, MatListModule],
  selector: 'app-task-list',
  styleUrl: './task-list.component.scss',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  public tasks = input<Task[]>([]);
}
