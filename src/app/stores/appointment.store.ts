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
      hour: '12:00',
      staffId: '1'
    },
    {
      id: '3',
      hour: '08:00',
      staffId: '4'
    },
    {
      id: '4',
      hour: '09:00',
      staffId: '2'
    },
  ]
}

export interface Appointment {
  id: string
  hour: string
  staffId: string
}
