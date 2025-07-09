import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-tasks',
  styleUrl: './tasks.component.scss',
  templateUrl: './tasks.component.html',
})
export class TasksComponent {}
