import {Injectable} from "@angular/core";
import {Staff} from "./staff.store";

@Injectable({
  providedIn: 'root'
})
export class StoreAppointments {

  appointments: any[] = []

  currentStaff: any = {}
  currentStaffId!: number
  currentDay: Date = new Date
  currentHour: string = ''
  currentEndHour: string = ''
  currentApp: any = {}
}
