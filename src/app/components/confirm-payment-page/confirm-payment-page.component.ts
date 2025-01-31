import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimaryBtnComponent } from '../global/primary-btn/primary-btn.component';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-confirm-payment-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent
  ],
  templateUrl: './confirm-payment-page.component.html',
  styleUrl: './confirm-payment-page.component.scss'
})
export class ConfirmPaymentPageComponent {
  ValidationService: any;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  form!: FormGroup

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: ValidationService.checkPasswords });
  }

  create() {
    if (!this.form.valid) return
    console.log('Create account')
  }
}
