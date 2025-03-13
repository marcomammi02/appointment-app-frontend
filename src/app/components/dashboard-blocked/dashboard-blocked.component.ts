import { Component } from '@angular/core';
import { PrimaryBtnComponent } from "../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-dashboard-blocked',
  standalone: true,
  imports: [PrimaryBtnComponent],
  templateUrl: './dashboard-blocked.component.html',
  styleUrl: './dashboard-blocked.component.scss'
})
export class DashboardBlockedComponent {

}
