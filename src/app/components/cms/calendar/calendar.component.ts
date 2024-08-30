import { Component } from '@angular/core';
import {Staff, StoreStaff} from "../../../stores/staff.store";
import {NgForOf, NgIf} from "@angular/common";
import {StoreAppointments} from "../../../stores/appointment.store";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  constructor(
    public storeStaff: StoreStaff,
    public storeAppointments: StoreAppointments,
  ) {}
  hours: string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00'
  ]

  getAppointment(hour: string, staff: Staff) {
    return this.storeAppointments.appointments.find(app => app.hour === hour && app.staffId === staff.id)
  }
}
