import {Injectable} from "@angular/core";
import {Staff} from "./staff.store";

@Injectable({
  providedIn: 'root'
})
export class StoreAppointments {

  appointments: Appointment[] = [
    {
      id: '1',
      hour: '10:00',
      staffId: '42'
    },
    {
      id: '2',
      hour: '11:00',
      staffId: '43'
    },

  ]

  currentStaff: any = {}
  currentHour: string = ''
}

export interface Appointment {
  id: string
  hour: string
  staffId: string
}
