import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServicesStore} from "../stores/services.store";

@Injectable({
  providedIn: 'root',
})
export class ServicesService {

  constructor(private http: HttpClient, private servicesStore: ServicesStore) {}

  private apiUrl: string = 'http://localhost:3000/services'

  getServices() {
    return this.http.get(this.apiUrl)
  }
}
