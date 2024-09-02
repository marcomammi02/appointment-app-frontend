import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServicesStore} from "../stores/services.store";
import {CreateServiceDto, UpdateServiceDto} from "../dtos/services.dto";

@Injectable({
  providedIn: 'root',
})
export class ServicesService {

  constructor(private http: HttpClient, private servicesStore: ServicesStore) {}

  private apiUrl: string = 'http://localhost:3000/services'

  getServices() {
    return this.http.get(this.apiUrl);
  }

  create(service: CreateServiceDto) {
    return this.http.post(this.apiUrl, service)
  }

  getDetail(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  update(id: number, service: UpdateServiceDto) {
    return this.http.patch(`${this.apiUrl}/${id}`, service)
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
