import { Component } from '@angular/core';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { PrimaryBtnComponent } from '../../global/primary-btn/primary-btn.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  loading: boolean = false
}
