import {Component} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  constructor(private router: Router) {
  }
  displaySidebar: boolean = false

  navigate(label: string) {
    this.router.navigate([`private/${label}`])
    this.displaySidebar = false
  }
}
