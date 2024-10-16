import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {
  capitalizeFirstLetter,
  firstLetter,
  formatDateToString,
  timeToMinutes,
  toTime
} from "../../../services/utility.service";
import {formatDate} from "date-fns";

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
    this.storeAppointments.currentStaff = ''
    this.storeAppointments.currentHour = ''
  }

  getAppointments() {
    return this.appointmentService.getAppointments(formatDateToString(this.storeAppointments.currentDay)).subscribe((res: any) => {
      this.storeAppointments.appointments = res
      console.log(res)
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

  getAppointmentForTime(hour: string, staff: Staff): any[] {
    const apps = this.storeAppointments.appointments.filter(
      app =>
        app.staffId == staff.id &&
        toTime(app.startTime) <= hour &&
        toTime(app.endTime) > hour
    );
    return apps;
  }

  alreadyCalled(app: any, hour: string) {
    return toTime(app.startTime) == hour;
  }

  goToCreation(hour: string, staff: any) {
    if (this.getAppointmentForTime(hour, staff).length > 0) return
    this.storeAppointments.currentHour = hour
    this.storeAppointments.currentStaff = staff
    this.router.navigate([`/private/${this.shopStore.shopId}/appointments/create`])
  }

  goToAppointment(app: any, hour: string, staff: any) {
    if (!app) return
    this.storeAppointments.currentHour = hour
    this.storeAppointments.currentStaff = staff
    this.storeAppointments.currentApp = app
    this.router.navigate([`/private/${this.shopStore.shopId}/appointments/${app.id}`])
  }

  getAppHeight(app: any) {
    let duration: number = timeToMinutes(app.endTime) - timeToMinutes(app.startTime)
    let pixels: number = (duration / 15) * 83.2;
    return `calc(${pixels}px - 6px)`;
  }

  getAppWidth(app: any, staff: any) {
    const timeRanges = this.storeAppointments.appointments
      .filter(existingApp => existingApp.staffId === staff.id && existingApp.id !== app.id )
      .map(app => ({
        startTime: timeToMinutes(app.startTime),
        endTime: timeToMinutes(app.endTime)
      }));
    for (let range of timeRanges) {
      if (timeToMinutes(app.startTime) < range.endTime && timeToMinutes(app.endTime) > range.startTime) {
        return '3px solid red'
      }
    }
    return 'none'
  }

  changeDate() {
    this.getAppointments()
  }

  protected readonly firstLetter = firstLetter;
  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
