import {Component, OnInit} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PrimaryBtnComponent} from "../global/primary-btn/primary-btn.component";
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import {ShopStore} from "../../stores/shop.store";
import { ErrorService, MyError } from '../../services/error.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent,
    RouterModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private shopStore: ShopStore,
    private router: Router,
    private errorService: ErrorService,
    private shopService: ShopService
  ) {}

  form!: FormGroup

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
    const v = this.form.value;

    this.shopStore.transparentLoading = true
    try {
      this.shopService.resetLocalStorage()
      const res = await this.authService.login(v.email, v.password).toPromise();
      this.shopStore.shopId = res.shopId;
      this.shopStore.slug = res.slug

      // Save shopId and slug in localstorage
      localStorage.setItem('shopId', this.shopStore.shopId.toString());
      localStorage.setItem('slug', this.shopStore.slug);
      this.router.navigate([`private/${this.shopStore.slug}`]);
      this.shopStore.transparentLoading = false
    } catch (error) {
      const err: MyError = {
        label: 'Attenzione',
        message: 'Email o Password errati'
      }
      this.errorService.showError(err)
      this.shopStore.transparentLoading = false
    }
  }
}
