import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  getDayOfWeek, minutesToTime,
  timeStringToHour,
  timeStringToMinutes,
  timeToMinutes, toDateTime,
  toTime
} from "../../../services/utility.service";
import { LoadingComponent } from "../../global/loading/loading.component";

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
    NgStyle,
    LoadingComponent
],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {
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

  loading: boolean = true

  currentTimePosition: string = '0px';
  markerOpacity: number = 1
  intervalId: any;

  @ViewChild('time-marker', { static: false }) timeMarker?: ElementRef;

  ngOnInit() {
    this.getStaff()
    this.getHours()
    this.getAvailabilitiesByDay()
    this.getAppointments()
    this.storeAppointments.currentStaff = ''
    this.storeAppointments.currentHour = ''
    this.availabilities = []
    setTimeout(() => this.scrollToTimeMarker(), 300);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  async getAppointments() {
    this.loading = true
    return this.appointmentService.getAppointments(formatDateToString(this.storeAppointments.currentDay)).subscribe({
      next: (res: any) => {
        this.storeAppointments.appointments = res;
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }

  async getAvailabilitiesByDay() {
    this.availabilities = []
    try {
      this.availabilities = await this.availabilitiesService.findAll(undefined, this.storeAppointments.currentDay.getDay()).toPromise();
    } catch (error) {
      console.log(error)
    }
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.storeStaff.staffList = res
    })
  }

  async getHours() {
    this.availabilitiesService.getWorkingHours(this.shopStore.shopId).subscribe(res => {
      this.shopStore.workingHours = res

      this.updateCurrentTimePosition();

      // Aggiorna la posizione ogni minuto
      this.intervalId = setInterval(() => this.updateCurrentTimePosition(), 60000);
    })
  }

  updateCurrentTimePosition() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Adatta l'altezza per il tuo layout (es. 80px per ogni ora)
    const hourHeight = (33 * 4); 
    const minuteHeight = hourHeight / 60; 

    // Calcola la posizione in pixel
    const shortedHours = hours - timeStringToHour(this.shopStore.workingHours[0])
    if (hours >= timeStringToHour(this.shopStore.workingHours[this.shopStore.workingHours.length - 1])) {
      this.markerOpacity = 0
      return
    }

    const position = (shortedHours * hourHeight + minutes * minuteHeight) + 40;

    this.currentTimePosition = `${position}px`;
  }

  @ViewChild('scrollableContainer') scrollableContainer?: ElementRef;

  scrollToTimeMarker() {
    const marker = document.getElementById('time-marker');
    const container = this.scrollableContainer?.nativeElement;
  
    if (container && marker && this.isToday(this.storeAppointments.currentDay)) {
      const markerPosition = marker.offsetTop;
      const containerHeight = container.clientHeight;
  
      container.scrollTo({
        top: markerPosition - containerHeight / 2,
        behavior: 'smooth'
      });
    }
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

    const inWorkHours = hourMinutes >= startTimeMinutes && hourMinutes < endTimeMinutes;

    const startBreakMinutes = av.startBreak ? timeStringToMinutes(av.startBreak) : null;
    const endBreakMinutes = av.endBreak ? timeStringToMinutes(av.endBreak) : null;

    const inBreakTime = startBreakMinutes !== null && endBreakMinutes !== null &&
      hourMinutes >= startBreakMinutes && hourMinutes < endBreakMinutes;

    return inWorkHours && !inBreakTime;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
    let pixels: number = (duration / 15) * 33;
    return `calc(${pixels}px - 8px)`
  }

  getAppWidth(app: any, staff: any): string {
    const startTimeMinutes = timeStringToMinutes(toTime(app.startTime));
    const endTimeMinutes = timeStringToMinutes(toTime(app.endTime));

    const overlapping = this.storeAppointments.appointments.some(existingApp =>
      existingApp.staffId === staff.id &&
      existingApp.id !== app.id &&
      timeStringToMinutes(toTime(existingApp.startTime)) < endTimeMinutes &&
      timeStringToMinutes(toTime(existingApp.endTime)) > startTimeMinutes
    );

    if (overlapping) {
      return '3px solid red';
    }

    const startAvailable = this.checkStaffAvailability(toTime(app.startTime), staff.id);
    const endAvailable = this.checkStaffAvailability(minutesToTime(endTimeMinutes - 1), staff.id);

    if (!startAvailable || !endAvailable) {
      return '3px solid red';
    }

    return `3px solid ${app.serviceColor}`;
  }

  getHourClass(hour: string): string {
    if (!hour) return ''

    switch (true) {
      case hour.includes(':00'):
        return 'full-hour';
      case hour.includes(':15'):
        return 'quarter-hour';
      case hour.includes(':30'):
        return 'half-hour';
      case hour.includes(':45'):
        return 'quarter-hour';
      default:
        return '';
    }
  }


  getBgColor(app: any) {
    return app.serviceColor
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

  openCalendar(calendar: any) {
    if (!calendar.overlayVisible) {
      calendar.showOverlay();
      calendar.cd.detectChanges();
    }
  }

  goToToday() {
    this.storeAppointments.currentDay = new Date
    this.ngOnInit()
  }

  protected readonly firstLetter = firstLetter;
  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
