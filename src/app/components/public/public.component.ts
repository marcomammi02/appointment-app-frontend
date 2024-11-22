import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { ShopStore } from '../../stores/shop.store';
import { LoadingComponent } from "../global/loading/loading.component";
import { NgFor, NgIf } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { ServicesStore } from '../../stores/services.store';
import {capitalizeFirstLetter} from "../../services/utility.service";


@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    NgFor,
    RouterModule,
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    public shopStore: ShopStore,
    private servicesService: ServicesService,
    public servicesStore: ServicesStore
  ) {}

  loading: boolean = true

  ngOnInit(): void {
    this.extractShopIdFromUrl()
    this.shopService.getShop()
    this.getServices()
  }

  extractShopIdFromUrl(): void {
    // Estrapola il parametro `shopId` dall'URL e lo converte in numero
    const shopIdParam = this.route.snapshot.paramMap.get('shopId');
    this.shopStore.shopId = shopIdParam ? +shopIdParam : 0;
  }

  async getServices() {
    this.servicesService.getServices().subscribe({
      next: (res) => {
        this.servicesStore.services = res
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
