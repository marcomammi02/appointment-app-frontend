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
import {
  capitalizeFirstLetter,
  firstLetter,
  formatDateToString,
  getDayOfWeek,
  timeStringToMinutes,
  timeToMinutes,
  toTime
} from "../../../services/utility.service";

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
    private appointmentService: AppointmentService,
  ) {}

  availabilities: any[] = []

  ngOnInit() {
    this.getStaff()
    this.getHours()
    this.getAppointments()
    this.getAvailabilitiesByDay()
    this.storeAppointments.currentStaff = ''
    this.storeAppointments.currentHour = ''
    this.availabilities = []
  }

  getAppointments() {
    return this.appointmentService.getAppointments(formatDateToString(this.storeAppointments.currentDay)).subscribe((res: any) => {
      this.storeAppointments.appointments = res
    })
  }

  async getAvailabilitiesByDay() {
    try {
      this.availabilities = await this.availabilitiesService.findAll(null, this.storeAppointments.currentDay.getDay()).toPromise();
    } catch (error) {
      console.log(error)
    }
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
    return this.storeAppointments.appointments.filter(
      app =>
        app.staffId == staff.id &&
        toTime(app.startTime) <= hour &&
        toTime(app.endTime) > hour
    );
  }

  checkStaffAvailability(hour: string, staffId: number): boolean {
    const av = this.availabilities.find(av => av.staffId === staffId);

    if (!av || !av.startTime) return false;

    const hourMinutes = timeStringToMinutes(hour);
    const startTimeMinutes = timeStringToMinutes(av.startTime);
    const endTimeMinutes = timeStringToMinutes(av.endTime);

    const isWithinWorkHours = hourMinutes >= startTimeMinutes && hourMinutes < endTimeMinutes;

    const startBreakMinutes = av.startBreak ? timeStringToMinutes(av.startBreak) : null;
    const endBreakMinutes = av.endBreak ? timeStringToMinutes(av.endBreak) : null;

    const isOutsideBreak =
      !startBreakMinutes || !endBreakMinutes ||
      hourMinutes < startBreakMinutes || hourMinutes >= endBreakMinutes;

    return isWithinWorkHours && isOutsideBreak;
  }

  alreadyCalled(app: any, hour: string) {
    return toTime(app.startTime) == hour;
  }

  goToCreation(hour: string, staff: any) {
    if (this.getAppointmentForTime(hour, staff).length > 0) return
    if (!this.checkStaffAvailability(hour, staff.id)) return
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

  getAppWidth(app: any, staff: any): string {
    const startTimeMinutes = timeStringToMinutes(toTime(app.startTime));
    const endTimeMinutes = timeStringToMinutes(toTime(app.endTime));

    // 1. Controllo sovrapposizione con altri appuntamenti dello stesso staff
    const overlapping = this.storeAppointments.appointments.some(existingApp =>
      existingApp.staffId === staff.id &&
      existingApp.id !== app.id &&
      timeStringToMinutes(toTime(existingApp.startTime)) < endTimeMinutes &&
      timeStringToMinutes(toTime(existingApp.endTime)) > startTimeMinutes
    );

    if (overlapping) {
      return '3px solid red'; // Sovrapposizione con un altro appuntamento
    }

    // 2. Controllo disponibilità del personale
    const startAvailable = this.checkStaffAvailability(toTime(app.startTime), staff.id);
    const endAvailable = this.checkStaffAvailability(toTime(app.endTime), staff.id);

    if (!startAvailable || !endAvailable) {
      return '3px solid red'; // Orario fuori dalla disponibilità del personale
    }

    return 'none'; // Nessun problema
  }


  navigateDay(days: number) {
    const newDate = new Date(this.storeAppointments.currentDay);
    newDate.setDate(newDate.getDate() + days);
    this.storeAppointments.currentDay = newDate;
    this.changeDate();
  }

  changeDate() {
    this.ngOnInit()
  }

  protected readonly firstLetter = firstLetter;
  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
