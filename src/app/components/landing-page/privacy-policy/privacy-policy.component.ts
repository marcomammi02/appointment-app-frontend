import { Component } from '@angular/core';
import { CancelBtnComponent } from "../../global/cancel-btn/cancel-btn.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CancelBtnComponent,
    RouterModule
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  email: string = 'bookami.app@gmail.com'

}
