import { Component, Host, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { ServicesService } from '../../../services/services.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShopStore } from '../../../stores/shop.store';
import { capitalizeFirstLetter, getDayOfWeek } from '../../../services/utility.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { StaffStore } from '../../../stores/staff.store';
import { StaffService } from '../../../services/staff.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreAppointments } from '../../../stores/appointment.store';
import { CalendarModule } from 'primeng/calendar';
import { AvailabilityService } from '../../../services/availability.service';
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    RouterModule,
    FloatLabelModule,
    DropdownModule,
    FormsModule,
    CalendarModule
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
    private location: Location,
    public storeAppointments: StoreAppointments,
    private appointmentService: AppointmentService,
    private availabilitiesService: AvailabilityService
  ) {}

  loading: boolean = true

  serviceId!: number

  service?: any

  selectedStaff: any = {}

  availabilities: any[] = []

  ngOnInit(): void {
    this.extractServiceIdFromUrl()
    this.getService()
    this.getShop()
    this.getStaff()
    this.appointmentService.setCurretDayToToday()
    this.getAvailabilitiesByDay()
  }
  
  getShop() {
    if (!this.shopStore.currentShop.id) {
      this.location.back()
    }
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.staffStore.staffList = res
      let whoever = {name: 'Qualsiasi'}
      this.staffStore.staffList = [whoever, ...this.staffStore.staffList]
      this.selectedStaff = whoever
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
      },
      (err) => {
        this.loading = false
        console.error(err)
      }
    )
  }

  async getAvailabilitiesByDay() {
    this.availabilities = []
    try {
      this.availabilities = await this.availabilitiesService.findAll(this.shopStore.currentShop.id, this.selectedStaff.id, this.storeAppointments.currentDay.getDay()).toPromise();
      console.log(this.availabilities)
    } catch (error) {
      console.log(error)
    }
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  navigateDay(days: number) {
    const newDate = new Date(this.storeAppointments.currentDay);
    newDate.setDate(newDate.getDate() + days);
    this.storeAppointments.currentDay = newDate;
    this.changeDate()
  }

  openCalendar(calendar: any) {
    if (!calendar.overlayVisible) {
      calendar.showOverlay();
      calendar.cd.detectChanges();
    }
  }

  changeDate() {
    this.getAvailabilitiesByDay()
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
