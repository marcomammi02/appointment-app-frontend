import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../../global/loading/loading.component";
import { ShopStore } from '../../../../stores/shop.store';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicesStore } from '../../../../stores/services.store';
import { capitalizeFirstLetter, getDayOfWeek } from '../../../../services/utility.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    RouterModule
  ],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.scss'
})
export class DataPageComponent implements OnInit{
  constructor(
    public shopStore: ShopStore,
    public storeService: ServicesStore,
    private location: Location,
  ) {}

  loading: boolean = false

  ngOnInit(): void {
    this.getShop()
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  getShop() {
    if (!this.shopStore.currentShop.id) {
      this.location.back()
    }
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
