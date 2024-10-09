import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ShopStore} from "../stores/shop.store";
import {CreateAppointmentDto} from "../dtos/appointments.dto";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient, private shopStore: ShopStore) {}

  private apiUrl: string = 'http://localhost:3000/appointments'

  create(appointment: CreateAppointmentDto) {
    return this.http.post(this.apiUrl, appointment)
  }

  getAppointments() {
    return this.http.get(`${this.apiUrl}/shop/${this.shopStore.shopId}`)
  }
}


