import { Component } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { PrimaryBtnComponent } from "../../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [PrimaryBtnComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {

  constructor(private paymentService: PaymentService) {}

  checkout(plan: 'monthly' | 'annual' | 'lifetime') {
    this.paymentService.createCheckoutSession(plan).subscribe((response) => {
      window.location.href = response.url; // Reindirizza a Stripe Checkout
    });
  }
}
