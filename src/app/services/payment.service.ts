import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl: string = environment.apiUrl + '/payments';

  constructor(private http: HttpClient) {}

  createCheckoutSession(plan: 'monthly' | 'annual' | 'lifetime') {
    return this.http.post<{ url: string }>(`${this.apiUrl}/checkout-session`, {
      plan,
    });
  }

  verifyPayment(sessionId: string) {
    return this.http
      .get(`${this.apiUrl}/verify-payment?session_id=${sessionId}`)
  }
}
