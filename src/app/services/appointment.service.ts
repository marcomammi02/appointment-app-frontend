import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ShopStore} from "../stores/shop.store";
import {CreateAppointmentDto, UpdateAppointmentDto} from "../dtos/appointments.dto";
import {UpdateAvailabilityDto} from "../dtos/availability.dto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient, private shopStore: ShopStore) {}

  private apiUrl: string = environment.apiUrl + '/appointments'

  create(appointment: CreateAppointmentDto) {
    return this.http.post(this.apiUrl, appointment)
  }

  getAppointments(day: string) {
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
}


