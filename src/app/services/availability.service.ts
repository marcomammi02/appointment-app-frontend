import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AvailabilityDayDto, CreateAvailabilityDto} from "../dtos/availability.dto";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/availabilities'

  create(availability: CreateAvailabilityDto) {
    return this.http.post(this.apiUrl, availability)
  }

  findAll(staffId?: number) {
    const options = staffId ? { params: { staffId: staffId } } : {}
    return this.http.get(this.apiUrl, options)
  }

  get week(): AvailabilityDayDto[] {
    return [
      {dayOfWeek: 0, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 1, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 2, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 3, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 4, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 5, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},
      {dayOfWeek: 6, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0},

    ]
  }
}
