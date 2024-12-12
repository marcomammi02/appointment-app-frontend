import { Component } from '@angular/core';
import { ShopStore } from '../../../../../stores/shop.store';
import { capitalizeFirstLetter, formatDateToStringDayFirst, getDayOfWeek } from '../../../../../services/utility.service';
import { StoreAppointments } from '../../../../../stores/appointment.store';
import { CancelBtnComponent } from "../../../../global/cancel-btn/cancel-btn.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirm-app',
  standalone: true,
  imports: [
    CancelBtnComponent,
    RouterModule
  ],
  templateUrl: './confirm-app.component.html',
  styleUrl: './confirm-app.component.scss'
})
export class ConfirmAppComponent {
  constructor(
    public shopStore: ShopStore,
    public storeAppointments: StoreAppointments
  ) {}

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly formatDateToStringDayFirst = formatDateToStringDayFirst;
  protected readonly getDayOfWeek = getDayOfWeek;
}
