import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EmployeesComponent} from "./employees/employees.component";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmployeesComponent, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'appointment-app-frontend';
}
