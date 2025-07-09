import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-task',
  styleUrl: './task.component.scss',
  templateUrl: './task.component.html',
})
export class TaskComponent {}
