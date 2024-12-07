import {Injectable} from "@angular/core";
import {Staff} from "./staff.store";

@Injectable({
  providedIn: 'root'
})
export class StoreAppointments {

  appointments: any[] = [
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
  currentDay: Date = new Date
  currentHour: string = ''
  currentEndHour: string = ''
  currentApp: any = {}
}
