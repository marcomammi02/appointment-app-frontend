import { Component, OnInit } from '@angular/core';
import { ShopStore } from '../../../../../stores/shop.store';
import {
  capitalizeFirstLetter,
  formatDateToStringDayFirst,
  getDayOfWeek,
} from '../../../../../services/utility.service';
import { StoreAppointments } from '../../../../../stores/appointment.store';
import { CancelBtnComponent } from '../../../../global/cancel-btn/cancel-btn.component';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirm-app',
  standalone: true,
  imports: [CancelBtnComponent, RouterModule],
  templateUrl: './confirm-app.component.html',
  styleUrl: './confirm-app.component.scss',
})
export class ConfirmAppComponent implements OnInit {
  constructor(
    public shopStore: ShopStore,
    public storeAppointments: StoreAppointments,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.goBack();
    this.shopStore.currentShop.id = null
  }

  goBack() {
    if (!this.shopStore.currentShop.id) {
      this.location.back();
    }
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly formatDateToStringDayFirst = formatDateToStringDayFirst;
  protected readonly getDayOfWeek = getDayOfWeek;
}
