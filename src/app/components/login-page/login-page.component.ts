import {Component, OnInit} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PrimaryBtnComponent} from "../global/primary-btn/primary-btn.component";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ShopStore} from "../../stores/shop.store";

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
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private shopStore: ShopStore,
    private router: Router
  ) {}

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

  async submit() {
    const v = this.form.value
    return this.authService.login(v.email, v.password).subscribe(res => {
      this.shopStore.shopId = res.shopId
      this.router.navigate([`private/${this.shopStore.shopId}`])
      localStorage.setItem('shopId', this.shopStore.shopId.toString())
    });
  }
}
