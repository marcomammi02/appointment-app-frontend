import {Component, OnInit} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PrimaryBtnComponent} from "../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  form: FormGroup

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  submit() {
    
  }
}
