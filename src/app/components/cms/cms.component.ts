import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.scss'
})
export class CmsComponent {

}
