import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from 'primeng/toast';
import {ErrorService} from "./services/error.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FloatLabelModule, InputTextModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(public errorService: ErrorService) {
  }
  title = 'appointment-app-frontend';
}
