import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavigationService } from '@/app/core/navigation/navigation.service';
import { Task, TASK_STATUS } from '@/app/tasks/models/task.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'app-task-item',
  styleUrl: './task-item.component.scss',
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  public readonly navigationService = inject(NavigationService);
  public readonly TASK_STATUS = TASK_STATUS;
  public fluid = input(false);
  public task = input<null | Task>();
  public taskDeleteEvent = output<Task>();
  public taskSwitchStatusEvent = output<Task>();
}
