import {Component, OnInit} from '@angular/core';
import {Staff, StaffStore} from "../../../stores/staff.store";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {StoreAppointments} from "../../../stores/appointment.store";
import {StaffService} from "../../../services/staff.service";
import {ShopStore} from "../../../stores/shop.store";
import {AvailabilityService} from "../../../services/availability.service";
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {Router, RouterLink} from "@angular/router";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";
import {AppointmentService} from "../../../services/appointment.service";
import {firstLetter, timeToMinutes, toTime} from "../../../services/utility.service";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PrimaryBtnComponent,
    RouterLink,
    CalendarModule,
    FormsModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  constructor(
    public storeStaff: StaffStore,
    public storeAppointments: StoreAppointments,
    private staffService: StaffService,
    public shopStore: ShopStore,
    private availabilitiesService: AvailabilityService,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}


  ngOnInit() {
    this.getStaff()
    this.getHours()
    this.getAppointments()
  }

  getAppointments() {
    return this.appointmentService.getAppointments().subscribe((res: any) => {
      this.storeAppointments.appointments = res
    })
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.storeStaff.staffList = res
    })
  }

  getHours() {
    this.availabilitiesService.getWorkingHours(this.shopStore.shopId).subscribe(res => {
      this.shopStore.workingHours = res
    })
  }

  getAppointmentForTime(hour: string, staff: Staff): any {
    return this.storeAppointments.appointments.find(app => {
      return app.staffId === staff.id && toTime(app.startTime) == hour;
    });
  }

  goToCreation(hour: string, staff: any) {
    if (this.getAppointmentForTime(hour, staff)) return
    this.storeAppointments.currentHour = hour
    this.storeAppointments.currentStaff = staff
    this.router.navigate([`/private/${this.shopStore.shopId}/appointments/create`])
  }

  getAppHeight(app: any) {
    let duration: number = timeToMinutes(app.endTime) - timeToMinutes(app.startTime)
    let pixels: number = (duration / 15) * 83.2;
    console.log(app)
    return `calc(${pixels}px - 6px)`;
  }

  protected readonly firstLetter = firstLetter;
}
