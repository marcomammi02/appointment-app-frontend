import {Component} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  displaySidebar: boolean = false
}
