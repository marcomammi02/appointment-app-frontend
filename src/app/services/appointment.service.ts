import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ShopStore} from "../stores/shop.store";
import {CreateAppointmentDto, UpdateAppointmentDto} from "../dtos/appointments.dto";
import {environment} from "../../environments/environment";
import { StoreAppointments } from "../stores/appointment.store";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(
    private http: HttpClient,
    private shopStore: ShopStore,
    private storeAppointment: StoreAppointments
  ) {}

  private apiUrl: string = environment.apiUrl + '/appointments'

  create(appointment: CreateAppointmentDto) {
    return this.http.post(this.apiUrl, appointment)
  }

  createPublic(appointment: CreateAppointmentDto) {
    return this.http.post(`${this.apiUrl}/public`, appointment)
  }

  getAppointments(day: string): Observable<any> {
    const options = { params: { day: day } }
    return this.http.get(`${this.apiUrl}/shop/${this.shopStore.shopId}`, options)
  }

  getDetail(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  update(id: number, updateApp: UpdateAppointmentDto) {
    return this.http.patch(`${this.apiUrl}/${id}`, updateApp)
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  setCurretDayToToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Imposta a mezzanotte locale
    this.storeAppointment.currentDay = today;
  }

  checkSlotAvailability(data: { date: string, startTime: string, endTime: string, staffId: number }): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-availability`, data);
  }
}


