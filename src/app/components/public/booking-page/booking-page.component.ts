import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { ServicesService } from '../../../services/services.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShopStore } from '../../../stores/shop.store';
import { capitalizeFirstLetter } from '../../../services/utility.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { StaffStore } from '../../../stores/staff.store';
import { StaffService } from '../../../services/staff.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    RouterModule,
    FloatLabelModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent implements OnInit {

  constructor(
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    public shopStore: ShopStore,
    public staffStore: StaffStore,
    private staffService: StaffService,
    private location: Location
  ) {}

  loading: boolean = true

  serviceId!: number

  service?: any

  selectedStaff!: any

  ngOnInit(): void {
    this.extractServiceIdFromUrl()
    this.getService()
    this.getShop()
    this.getStaff()
  }
  
  getShop() {
    if (!this.shopStore.currentShop.id) {
      this.location.back()
    }
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.staffStore.staffList = res
      this.staffStore.staffList.push({name: 'Qualsiasi'})
      this.selectedStaff = this.staffStore.staffList[this.staffStore.staffList.length - 1]
    })
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

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
