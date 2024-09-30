import { Component } from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {PrimeTemplate} from "primeng/api";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ShopStore} from "../../../../stores/shop.store";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-app',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    CancelBtnComponent,
    FloatLabelModule,
    InputTextModule,
    NgForOf,
    PaginatorModule,
    PrimaryBtnComponent,
    PrimeTemplate,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss'
})
export class CreateAppComponent {
  constructor(public shopStore: ShopStore) {
  }

  form!: FormGroup
}
