import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { ShopStore } from '../../stores/shop.store';
import { LoadingComponent } from "../global/loading/loading.component";
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { ServicesStore } from '../../stores/services.store';
import {capitalizeFirstLetter} from "../../services/utility.service";
import { StoreAppointments } from '../../stores/appointment.store';


@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    NgFor,
    RouterModule,
    NgStyle
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
    public servicesStore: ServicesStore,
    private storeAppointments: StoreAppointments
  ) {}

  loading: boolean = true

  ngOnInit(): void {
    this.extractSlugFromUrl()
    this.storeAppointments.appToEdit = {}
  }

  async extractSlugFromUrl() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.shopStore.slug = slug ? slug : "";

    try {
      // Aspetta che getShopPublic() sia completata
      await this.shopService.getShopPublic();

      // Dopo che getShopPublic è completato, esegui getServices()
      this.getServices();
    } catch (error) {
      console.error('Errore durante il recupero del negozio', error);
    }
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

  isShopDataReady(): boolean {
    return !!this.shopStore.currentShop && Object.keys(this.shopStore.currentShop).length > 0 && !this.loading;
}


  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
