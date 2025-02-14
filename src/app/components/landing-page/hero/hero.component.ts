import { Component } from '@angular/core';
import { PrimaryBtnComponent } from "../../global/primary-btn/primary-btn.component";
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [PrimaryBtnComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

  constructor(private paymentService: PaymentService) {}

  checkout(plan: 'monthly' | 'annual' | 'lifetime') {
    this.paymentService.createCheckoutSession(plan).subscribe((response) => {
      window.location.href = response.url; // Reindirizza a Stripe Checkout
    });
  }
}
