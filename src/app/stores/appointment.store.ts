import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StoreAppointments {

  appointments: Appointment[] = [
    {
      id: '1',
      hour: '10:00',
      staffId: '3'
    },
    {
      id: '2',
      hour: '11:00',
      staffId: '5'
    },

  ]
}

export interface Appointment {
  id: string
  hour: string
  staffId: string
}
