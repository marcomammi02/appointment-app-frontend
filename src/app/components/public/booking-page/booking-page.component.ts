import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { ServicesService } from '../../../services/services.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit {

  constructor(
    private servicesService: ServicesService,
    private route: ActivatedRoute
  ) {}

  loading: boolean = true

  serviceId!: number

  service?: any

  ngOnInit(): void {
    this.extractShopIdFromUrl()
    this.getService()
  }

  extractShopIdFromUrl(): void {
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
}
