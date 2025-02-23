import { Component } from '@angular/core';
import { CancelBtnComponent } from '../../global/cancel-btn/cancel-btn.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [CancelBtnComponent, RouterModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
 email: string = 'bookami.app@gmail.com'
}
