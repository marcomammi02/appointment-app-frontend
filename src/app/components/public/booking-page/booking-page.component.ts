import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { CommonModule, NgIf } from '@angular/common';
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
import { ServicesStore } from '../../../stores/services.store';

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
    CalendarModule,
    CommonModule,
  ],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss',
})
export class BookingPageComponent implements OnInit {

  constructor(
    private servicesService: ServicesService,
    private storeService: ServicesStore,
    private route: ActivatedRoute,
    public shopStore: ShopStore,
    public staffStore: StaffStore,
    private staffService: StaffService,
    private location: Location,
    public storeAppointments: StoreAppointments,
    private appointmentService: AppointmentService,
    private availabilitiesService: AvailabilityService,
  ) {}

  loading: boolean = true

  avLoading: boolean = true

  serviceId!: number

  service?: any

  selectedStaff: any = {}

  availabilities: any[] = []

  slots: any[] = []

  ngOnInit(): void {
    this.extractServiceIdFromUrl()
    this.getShop()
    this.getService()
    this.appointmentService.setCurretDayToToday()
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

  async getService() {
    return this.servicesService.getDetail(this.serviceId).subscribe(
      (res) => {
        this.service = res;
        this.storeService.currentService = res
        this.getStaff()
        this.getAvailabilitiesByDay()
      },
      (err) => {
        this.loading = false;
        console.error(err);
      }
    )
  }

  async getAvailabilitiesByDay() {
    this.availabilities = [];
    this.slots = []; // Array per memorizzare gli slot generati
    const step = 15; // Intervallo in minuti per il calcolo degli slot
    this.avLoading = true

    try {
      // Recupera le availabilities
      this.availabilities = await this.availabilitiesService
        .findAll(this.shopStore.currentShop.id, this.selectedStaff.id, this.storeAppointments.currentDay.getDay())
        .toPromise();

      console.log('Availabilities:', this.availabilities);

      // Calcola gli slot per ogni availability
      this.availabilities.forEach((availability) => {
        if (this.service?.duration) {
          const slots = this.generateSlotsFromAvailability(availability, this.service.duration, step);
          this.slots.push(...slots);
        } else {
          console.warn('Service duration is undefined. Skipping slot generation.');
        }
      });

      // Rimuove duplicati dagli slot
      this.slots = this.removeDuplicateSlots(this.slots);

      console.log('Generated Slots:', this.slots);
      this.loading = false
      this.avLoading = false
    } catch (error) {
      this.loading = false
      console.error(error);
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

  // Metodo per calcolare gli slot basati su una disponibilità
generateSlotsFromAvailability(
  availability: any,
  serviceDuration: number,
  step: number
): { start: string; end: string }[] {
  const { startTime, endTime, startBreak, endBreak } = availability;
  const slots: any[] = [];
  const stepMs = step * 60 * 1000; // Step in millisecondi
  const durationMs = serviceDuration * 60 * 1000; // Durata del servizio in millisecondi

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  };

  const addSlots = (start: Date, end: Date) => {
    let current = start;
    while (current < end) {
      const slotEnd = new Date(current.getTime() + durationMs);
      if (slotEnd <= end) {
        slots.push({ start: current.toTimeString().slice(0, 5), end: slotEnd.toTimeString().slice(0, 5) });
      }
      current = new Date(current.getTime() + stepMs);
    }
  };

  // Genera slot prima della pausa
  addSlots(parseTime(startTime), parseTime(startBreak || endTime));

  // Genera slot dopo la pausa
  if (startBreak && endBreak) {
    addSlots(parseTime(endBreak), parseTime(endTime));
  }

  return slots;
}

// Metodo per rimuovere duplicati dagli slot
removeDuplicateSlots(slots: { start: string; end: string }[]): { start: string; end: string }[] {
  const uniqueSlots = new Map(); // Utilizziamo una mappa per tenere traccia degli slot unici
  slots.forEach((slot) => {
    const key = `${slot.start}-${slot.end}`; // Crea una chiave unica basata su start e end
    if (!uniqueSlots.has(key)) {
      uniqueSlots.set(key, slot); // Aggiunge lo slot se non esiste già
    }
  });
  return Array.from(uniqueSlots.values()); // Ritorna gli slot come array
}

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
