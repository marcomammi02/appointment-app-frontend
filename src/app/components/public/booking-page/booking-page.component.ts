import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../global/loading/loading.component';
import { CommonModule, NgIf } from '@angular/common';
import { ServicesService } from '../../../services/services.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShopStore } from '../../../stores/shop.store';
import {
  capitalizeFirstLetter,
  formatDateToString,
  getDayOfWeek,
} from '../../../services/utility.service';
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

class Slot {
  start!: string;
  end!: string;
  staffId!: number[];
}

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
    private router: Router
  ) {}

  loading: boolean = true;

  avLoading: boolean = true;

  serviceId!: number;

  service?: any;

  originalStaffList: any = [];

  selectedStaff: any = {};

  availabilities: any[] = [];

  slots: Slot[] = [];

  appointments: any[] = [];

  today!: Date;

  ngOnInit(): void {
    this.today = new Date();
    this.extractServiceIdFromUrl();
    this.getShop();
    this.getService();
    this.appointmentService.setCurretDayToToday();
  }

  getShop() {
    if (!this.shopStore.currentShop.id) {
      this.location.back();
    }
  }

  getStaff() {
    this.staffService.getStaff().subscribe((res) => {
      this.originalStaffList = res;
      let whoever = { name: 'Qualsiasi' };
      this.staffStore.staffList = [whoever, ...this.originalStaffList];
      this.selectedStaff = whoever;
    });
  }

  extractServiceIdFromUrl(): void {
    // Estrapola il parametro `serviceId` dall'URL e lo converte in numero
    const serviceIdParam = this.route.snapshot.paramMap.get('serviceId');
    this.serviceId = serviceIdParam ? +serviceIdParam : 0;
  }

  async getService() {
    return this.servicesService.getDetail(this.serviceId).subscribe(
      (res) => {
        this.service = res;
        this.storeService.currentService = res;
        this.getStaff();
        this.getAvailabilitiesByDay();
      },
      (err) => {
        this.loading = false;
        console.error(err);
      }
    );
  }

  async getAvailabilitiesByDay() {
    this.availabilities = [];
    this.slots = [];
    this.appointments = [];
    const step = 15; // Intervallo in minuti per il calcolo degli slot
    this.avLoading = true;

    try {
      // Recupera le availabilities
      this.availabilities = await this.availabilitiesService
        .findAll(
          this.shopStore.currentShop.id,
          this.selectedStaff.id,
          this.storeAppointments.currentDay.getDay()
        )
        .toPromise();

      // Recupera gli appuntamenti
      this.appointments = await this.appointmentService
        .getAppointments(formatDateToString(this.storeAppointments.currentDay))
        .toPromise();

      // Genera gli slot occupati dagli appuntamenti
      const occupiedSlots: Slot[] = [];
      this.appointments.forEach((appointment) => {
        const slots = this.generateSlotFromAppointment(appointment, step);
        occupiedSlots.push(...slots);
      });

      // Calcola gli slot disponibili per ogni availability
      this.availabilities.forEach((availability) => {
        if (this.service?.duration) {
          const availableSlots = this.generateSlotsFromAvailability(
            availability,
            this.service.duration,
            step,
            occupiedSlots // Passa gli slot occupati
          );
          this.slots.push(...availableSlots);
        } else {
          console.warn(
            'Service duration is undefined. Skipping slot generation.'
          );
        }
      });

      // Rimuove duplicati dagli slot
      this.slots = this.removeDuplicateSlots(this.slots);

      this.loading = false;
      this.avLoading = false;
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  generateSlotsFromAvailability(
    availability: any,
    serviceDuration: number,
    step: number,
    occupiedSlots: Slot[]
  ): Slot[] {
    const { startTime, endTime, startBreak, endBreak, staffId } = availability;
    const slots: Slot[] = [];
    const stepMs = step * 60 * 1000; // Step in millisecondi
    const durationMs = serviceDuration * 60 * 1000; // Durata del servizio in millisecondi
    const now = new Date(); // Ottieni l'orario corrente

    const parseTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date(); // Usa la data corrente
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const addSlots = (start: Date, end: Date) => {
      let current = start;
      while (current < end) {
        const slotEnd = new Date(current.getTime() + durationMs);
        if (slotEnd <= end) {
          const slot = {
            start: current.toTimeString().slice(0, 5),
            end: slotEnd.toTimeString().slice(0, 5),
            staffId: [staffId],
          };
          // Verifica che lo slot non si sovrapponga agli slot occupati
          if (!this.isSlotOccupied(slot, occupiedSlots)) {
            // Se è oggi, mostra solo gli slot futuri
            if (this.isToday() && current >= now) {
              slots.push(slot);
            }
            // Altrimenti, aggiungi tutti gli slot
            else if (!this.isToday()) {
              slots.push(slot);
            }
          }
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


  // Controlla se il giorno corrente è oggi
  isToday(): boolean {
    const today = new Date();
    const selectedDay = this.storeAppointments.currentDay;
    return (
      today.getDate() === selectedDay.getDate() &&
      today.getMonth() === selectedDay.getMonth() &&
      today.getFullYear() === selectedDay.getFullYear()
    );
  }

  // Metodo che verifica se uno slot è occupato, tenendo conto della presenza di più membri dello staff
  isSlotOccupied(slot: Slot, occupiedSlots: Slot[]): boolean {
    const slotStart = new Date(`1970-01-01T${slot.start}:00`);
    const slotEnd = new Date(`1970-01-01T${slot.end}:00`);

    // Verifica per ogni slot occupato
    return occupiedSlots.some((occupied) => {
      const occupiedStart = new Date(`1970-01-01T${occupied.start}:00`);
      const occupiedEnd = new Date(`1970-01-01T${occupied.end}:00`);

      // Controlla la sovrapposizione tra lo slot e gli slot occupati
      const isOverlapping = slotStart < occupiedEnd && slotEnd > occupiedStart; // Se sovrappone in qualsiasi modo

      // Se lo slot si sovrappone con uno degli slot occupati e contiene tutti gli stessi staffId
      if (isOverlapping) {
        // Verifica che tutti i membri dello staff nello slot siano già occupati
        return slot.staffId.every((staffId) =>
          occupied.staffId.includes(staffId)
        );
      }

      return false;
    });
  }

  generateSlotFromAppointment(appointment: any, step: number): Slot[] {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    const durationMs = step * 60 * 1000;
    const occupiedSlots: Slot[] = [];

    let current = startTime;
    while (current < endTime) {
      const slotEnd = new Date(current.getTime() + durationMs);
      if (slotEnd <= endTime) {
        occupiedSlots.push({
          start: current.toISOString().slice(11, 16),
          end: slotEnd.toISOString().slice(11, 16),
          staffId: [appointment.staffId],
        });
      }
      current = new Date(current.getTime() + durationMs);
    }

    return occupiedSlots;
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`;
    if (hours > 0 && min == 0) return `${hours} h`;
    return `${hours} h ${min} min`;
  }

  navigateDay(days: number) {
    if (this.isToday() && days == -1) return;
    const newDate = new Date(this.storeAppointments.currentDay);
    newDate.setDate(newDate.getDate() + days);
    this.storeAppointments.currentDay = newDate;
    this.changeDate();
  }

  openCalendar(calendar: any) {
    if (!calendar.overlayVisible) {
      calendar.showOverlay();
      calendar.cd.detectChanges();
    }
  }

  changeDate() {
    this.getAvailabilitiesByDay();
  }

  // Metodo per rimuovere duplicati dagli slot e riordinarli
removeDuplicateSlots(slots: Slot[]): Slot[] {
  const uniqueSlots = new Map<string, Slot>(); // Mappa per tenere traccia degli slot unici

  slots.forEach((slot) => {
    const key = `${slot.start}-${slot.end}`; // Crea una chiave unica basata su start e end

    if (uniqueSlots.has(key)) {
      // Se la chiave esiste, aggiungi l'ID dello staff all'array esistente
      const existingSlot = uniqueSlots.get(key);
      if (existingSlot) {
        // Aggiungi lo staffId solo se non è già presente nell'array
        slot.staffId.forEach((id) => {
          if (!existingSlot.staffId.includes(id)) {
            existingSlot.staffId.push(id);
          }
        });
      }
    } else {
      // Se la chiave non esiste, aggiungi il nuovo slot
      uniqueSlots.set(key, { ...slot });
    }
  });

  return Array.from(uniqueSlots.values()).sort((a, b) => {
    // Aggiungi una data fittizia per interpretare le ore come date
    const timeA: any = new Date("1970-01-01T" + a.start + ":00Z");
    const timeB: any = new Date("1970-01-01T" + b.start + ":00Z");
    return timeA - timeB;
  });
}

  goToDataPage(slot: any) {
    this.storeAppointments.currentHour = slot.start;
    this.storeAppointments.currentEndHour = slot.end;
    if (!this.selectedStaff.id) {
      this.storeAppointments.currentStaffId = this.getCasualStaff(slot.staffId);
    } else {
      this.storeAppointments.currentStaffId = this.selectedStaff.id;
    }
    this.router.navigate([
      '/' + this.shopStore.slug + '/service/' + this.service.id + '/datas',
    ]);
  }

  // Return casual staff member
  getCasualStaff(staffList: number[]): any {
    if (!staffList || staffList.length === 0) {
      return null; // Restituisce null se la lista è vuota o non valida
    }
    const randomIndex = Math.floor(Math.random() * staffList.length);
    return staffList[randomIndex];
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly getDayOfWeek = getDayOfWeek;
}
