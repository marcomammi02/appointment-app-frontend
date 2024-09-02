import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cancel-btn',
  standalone: true,
  imports: [],
  templateUrl: './cancel-btn.component.html',
  styleUrl: './cancel-btn.component.scss'
})
export class CancelBtnComponent {
  @Input() icon: string = ''
  @Input() label: string = ''
}
