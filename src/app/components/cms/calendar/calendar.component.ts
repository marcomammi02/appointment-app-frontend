import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Staff, StaffStore } from '../../../stores/staff.store';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { StoreAppointments } from '../../../stores/appointment.store';
import { StaffService } from '../../../services/staff.service';
import { ShopStore } from '../../../stores/shop.store';
import { AvailabilityService } from '../../../services/availability.service';
import { PrimaryBtnComponent } from '../../global/primary-btn/primary-btn.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../services/appointment.service';
import {
  capitalizeFirstLetter,
  convertLocalToUTC,
  firstLetter,
  formatDateToString,
  getDayOfWeek,
  minutesToTime,
  timeStringToHour,
  timeStringToMinutes,
  timeToMinutes,
  toDateTime,
  toTime,
} from '../../../services/utility.service';
import { LoadingComponent } from '../../global/loading/loading.component';
import { AbsenceService } from '../../../services/absence.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PrimaryBtnComponent,
    CalendarModule,
    FormsModule,
    NgClass,
    NgStyle,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
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
    private absenceService: AbsenceService
  ) {}

  availabilities: any[] = [];

  loading: boolean = true;

  currentTimePosition: string = '';
  markerOpacity: number = 1;
  intervalId: any;

  absences: any[] = [];

  @ViewChild('time-marker', { static: false }) timeMarker?: ElementRef;

  ngOnInit() {
    this.storeAppointments.currentDay.setHours(0, 0, 0, 0);
    this.getStaff();
    this.getHours();
    this.getAvailabilitiesByDay();
    this.getAppointments();
    this.storeAppointments.currentStaff = '';
    this.storeAppointments.currentHour = '';
    this.availabilities = [];
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  async getAppointments() {
    this.loading = true;
    return this.appointmentService
      .getAppointments(formatDateToString(this.storeAppointments.currentDay))
      .subscribe({
        next: (res: any) => {
          this.storeAppointments.appointments = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  async getAvailabilitiesByDay() {
    this.availabilities = [];
    try {
      this.availabilities = await this.availabilitiesService
        .findByShopId(
          this.shopStore.shopId,
          this.storeAppointments.currentDay.getDay()
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  async getStaff() {
    try {
      // Ottieni la lista dello staff
      const res: any = await this.staffService.getStaff().toPromise();
      this.storeStaff.staffList = res;

      // Crea un array di promesse per le assenze
      const absenceRequests = res.map((staff: Staff) =>
        this.absenceService
          .getAbsencesByStaffAndDay(
            [+staff.id],
            convertLocalToUTC(this.storeAppointments.currentDay)
          )
          .toPromise()
      );
      console.log(convertLocalToUTC(this.storeAppointments.currentDay))

      // Attendi tutte le promesse per le assenze
      const absences: any[] = await Promise.all(absenceRequests);

      // Appiattisci l'array di assenze in un unico array
      this.absences = absences.flat();
      console.log(this.absences);
    } catch (error) {
      console.error('Errore durante il recupero delle assenze:', error);
    }
  }

  async getHours() {
    this.availabilitiesService
      .getWorkingHours(this.shopStore.shopId)
      .subscribe((res) => {
        this.shopStore.workingHours = res;

        this.updateCurrentTimePosition();
        setTimeout(() => this.scrollToTimeMarker(), 300);

        // Aggiorna la posizione ogni minuto
        this.intervalId = setInterval(
          () => this.updateCurrentTimePosition(),
          60000
        );
      });
  }

  updateCurrentTimePosition() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Adatta l'altezza per il tuo layout (es. 33px per quarto d'ora)
    const hourHeight = 33 * 4;
    const minuteHeight = hourHeight / 60;

    // Converte il primo orario di lavoro in ore e minuti
    const [startHour, startMinute] = this.shopStore.workingHours[0]
      .split(':')
      .map((part: string) => parseInt(part, 10));

    // Confronta l'ora corrente con l'inizio dell'orario di lavoro
    const shortedHours = hours - startHour;
    const shortedMinutes = minutes - startMinute;

    // Controlla se il marker è fuori dall'orario lavorativo
    if (hours < startHour || (hours === startHour && minutes < startMinute)) {
      this.markerOpacity = 0;
      return;
    }

    const endHour = timeStringToHour(
      this.shopStore.workingHours[this.shopStore.workingHours.length - 1]
    );
    if (hours > endHour || (hours === endHour && minutes > 0)) {
      this.markerOpacity = 0;
      return;
    }

    // Calcola la posizione in pixel (considera ore e minuti dall'inizio della giornata lavorativa)
    const position =
      shortedHours * hourHeight + shortedMinutes * minuteHeight + 40;

    this.currentTimePosition = `${position}px`;
  }

  @ViewChild('scrollableContainer') scrollableContainer?: ElementRef;

  scrollToTimeMarker() {
    const marker = document.getElementById('time-marker');
    const container = this.scrollableContainer?.nativeElement;

    if (
      container &&
      marker &&
      this.isToday(this.storeAppointments.currentDay)
    ) {
      const markerPosition = marker.offsetTop;
      const containerHeight = container.clientHeight;

      container.scrollTo({
        top: markerPosition - containerHeight / 2,
        behavior: 'smooth',
      });
    }
  }

  getAppointmentForTime(hour: string, staff: Staff): any[] {
    return this.storeAppointments.appointments.filter(
      (app) =>
        app.staffId == staff.id &&
        toTime(app.startTime) <= hour &&
        toTime(app.endTime) > hour
    );
  }

  checkStaffAvailability(hour: string, staffId: number): boolean {
    const av = this.availabilities.find((av) => av.staffId === staffId);
    if (!av || !av.startTime || !av.endTime) return false;

    const hourMinutes = timeStringToMinutes(hour);
    const startTimeMinutes = timeStringToMinutes(av.startTime);
    const endTimeMinutes = timeStringToMinutes(av.endTime);

    const inWorkHours =
      hourMinutes >= startTimeMinutes && hourMinutes < endTimeMinutes;

    const startBreakMinutes = av.startBreak
      ? timeStringToMinutes(av.startBreak)
      : null;
    const endBreakMinutes = av.endBreak
      ? timeStringToMinutes(av.endBreak)
      : null;

    const inBreakTime =
      startBreakMinutes !== null &&
      endBreakMinutes !== null &&
      hourMinutes >= startBreakMinutes &&
      hourMinutes < endBreakMinutes;

    return inWorkHours && !inBreakTime;
  }

  checkAbsenceForTime(hour: string, staffId: number): boolean {
    // Trova l'assenza per lo staff
    const absence = this.absences.find((abs) => abs.staffId === staffId);

    // Se non ci sono assenze, ritorna false
    if (!absence) return false;

    // Se l'assenza è per tutto il giorno (assenza totale)
    if (!absence.startTime && !absence.endTime) {
      return true; // Assenza totale, quindi sempre true
    }

    // Se ci sono startTime e endTime, verifica se l'orario è dentro l'intervallo di assenza
    const hourMinutes = timeStringToMinutes(hour);
    const startAbsenceMinutes = timeStringToMinutes(absence.startTime);
    const endAbsenceMinutes = timeStringToMinutes(absence.endTime);

    // Verifica se l'orario corrente è all'interno dell'assenza
    return (
      hourMinutes >= startAbsenceMinutes && hourMinutes < endAbsenceMinutes
    );
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
    if (this.getAppointmentForTime(hour, staff).length > 0) return;
    if (!this.checkStaffAvailability(hour, staff.id)) return;
    if (this.checkAbsenceForTime(hour, staff.id)) return
    this.storeAppointments.currentHour = hour;
    this.storeAppointments.currentStaff = staff;
    this.router.navigate([
      `/private/${this.shopStore.slug}/appointments/create`,
    ]);
  }

  goToAppointment(app: any, hour: string, staff: any) {
    if (!app) return;
    this.storeAppointments.currentHour = hour;
    this.storeAppointments.currentStaff = staff;
    this.storeAppointments.currentApp = app;
    this.router.navigate([
      `/private/${this.shopStore.slug}/appointments/${app.id}`,
    ]);
  }

  getAppHeight(app: any) {
    let duration: number =
      timeToMinutes(app.endTime) - timeToMinutes(app.startTime);
    let pixels: number = (duration / 15) * 33;
    return `calc(${pixels}px - 8px)`;
  }

  getAppWidth(app: any, staff: any): string {
    const startTimeMinutes = timeStringToMinutes(toTime(app.startTime));
    const endTimeMinutes = timeStringToMinutes(toTime(app.endTime));

    const overlapping = this.storeAppointments.appointments.some(
      (existingApp) =>
        existingApp.staffId === staff.id &&
        existingApp.id !== app.id &&
        timeStringToMinutes(toTime(existingApp.startTime)) < endTimeMinutes &&
        timeStringToMinutes(toTime(existingApp.endTime)) > startTimeMinutes
    );

    if (overlapping) {
      return '5px solid red';
    }

    const startAvailable = this.checkStaffAvailability(
      toTime(app.startTime),
      staff.id
    );
    const endAvailable = this.checkStaffAvailability(
      minutesToTime(endTimeMinutes - 1),
      staff.id
    );

    if (!startAvailable || !endAvailable) {
      return '5px solid red';
    }

    return `5px solid ${app.serviceColor}`;
  }

  getHourClass(hour: string): string {
    if (!hour) return '';

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
    return app.serviceColor;
  }

  navigateDay(days: number) {
    const newDate = new Date(this.storeAppointments.currentDay);
    newDate.setDate(newDate.getDate() + days);
    this.storeAppointments.currentDay = newDate;
    this.changeDate();
  }

  changeDate() {
    this.ngOnInit();
  }

  openCalendar(calendar: any) {
    if (!calendar.overlayVisible) {
      calendar.showOverlay();
      calendar.cd.detectChanges();
    }
  }

  goToToday() {
    this.storeAppointments.currentDay = new Date()
    this.storeAppointments.currentDay.setHours(0, 0, 0, 0);
    this.ngOnInit();
  }

  protected readonly firstLetter = firstLetter;
  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
  protected readonly toTime = toTime;
}
