import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimaryBtnComponent } from '../global/primary-btn/primary-btn.component';
import { ValidationService } from '../../services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-payment-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent,
  ],
  templateUrl: './confirm-payment-page.component.html',
  styleUrl: './confirm-payment-page.component.scss',
})
export class ConfirmPaymentPageComponent {
  ValidationService: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  form!: FormGroup;

  ngOnInit() {
    // Ottieni il session_id dal parametro dell'URL
    this.route.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];

      if (!sessionId) {
        this.router.navigate(['/']);
      }

      // Chiamata per verificare il pagamento
      this.verifyPayment(sessionId);
    });

    this.buildForm();
  }

  verifyPayment(sessionId: string) {
    this.paymentService.verifyPayment(sessionId).subscribe(
      (res: any) => {
        // Gestisci la risposta, ad esempio crea un account o mostra un errore
        console.log('Pagamento verificato con successo', res);
      },
      (err: any) => {
        // Gestisci l'errore, ad esempio mostra un messaggio di errore
        console.error('Errore nella verifica del pagamento', err);
        this.router.navigate(['/']);
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, ValidationService.emailValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: ValidationService.checkPasswords }
    );
  }

  create() {
    if (!this.form.valid) return;
    console.log('Create account');
  }
}
