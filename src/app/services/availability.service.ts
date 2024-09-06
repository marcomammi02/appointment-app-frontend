import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CreateAvailabilityDto} from "../dtos/availability.dto";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/availabilities'

  create(availability: CreateAvailabilityDto) {
    return this.http.post(this.apiUrl, availability)
  }
}
