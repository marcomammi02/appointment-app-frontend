import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { ServicesService } from '../../../services/services.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShopStore } from '../../../stores/shop.store';
import { capitalizeFirstLetter } from '../../../services/utility.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    RouterModule
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit {

  constructor(
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    public shopStore: ShopStore
  ) {}

  loading: boolean = true

  serviceId!: number

  service?: any

  ngOnInit(): void {
    this.extractServiceIdFromUrl()
    this.getService()
    this.getShop()
  }

  getShop() {
    if (!this.shopStore.currentShop.id) {
      // Attempt to retrieve shop from localStorage
      const storedShop = localStorage.getItem('currentShop');
      this.shopStore.currentShop = storedShop ? JSON.parse(storedShop) : null;
    }
  }

  extractServiceIdFromUrl(): void {
    // Estrapola il parametro `serviceId` dall'URL e lo converte in numero
    const serviceIdParam = this.route.snapshot.paramMap.get('serviceId');
    this.serviceId = serviceIdParam ? +serviceIdParam : 0
  }

  getService() {
    this.servicesService.getDetail(this.serviceId).subscribe(
      (res) => {
        this.service = res
        this.loading = false
        console.log(res)
      },
      (err) => {
        this.loading = false
        console.error(err)
      }
    )
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
