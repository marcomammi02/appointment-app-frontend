import { NgIf } from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-primary-btn',
  standalone: true,
  imports: [NgIf],
  templateUrl: './primary-btn.component.html',
  styleUrl: './primary-btn.component.scss'
})
export class PrimaryBtnComponent {

  @Input() icon: string = ''
  @Input() label: string = ''
}
