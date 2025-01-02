import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'hamburger-btn',
  standalone: true,
  imports: [],
  templateUrl: './hamburger-btn.component.html',
  styleUrl: './hamburger-btn.component.scss'
})
export class HamburgerBtnComponent {
  @Input() menuValue?: boolean;
}
