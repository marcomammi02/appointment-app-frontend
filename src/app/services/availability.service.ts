import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AvailabilityDayDto, CreateAvailabilityDto, UpdateAvailabilityDto } from "../dtos/availability.dto";
import { map, Observable } from "rxjs";
import { ShopStore } from "../stores/shop.store";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  constructor(private http: HttpClient, private shopStore: ShopStore) { }

  private apiUrl: string = environment.apiUrl + '/availabilities'

  create(availability: CreateAvailabilityDto) {
    return this.http.post(this.apiUrl, availability)
  }

  findByShopId(shopId: number, dayOfWeek?: number): Observable<any> {
    console.log("Chiamata API con shopId:", shopId, "dayOfWeek:", dayOfWeek);
    return this.http.get<any>(`${this.apiUrl}/shop/${shopId}/day/${dayOfWeek}`);
  }

  findAllByStaffIds(staffIds: number[], dayOfWeek?: number): Observable<any> {
    console.log("Chiamata API con staffIds:", staffIds, "dayOfWeek:", dayOfWeek);
  
    let params: any = {};
  
    if (dayOfWeek !== undefined) {
      params.dayOfWeek = dayOfWeek; // Se è definito, lo aggiunge all'oggetto params
    }
  
    return this.http.get<any>(`${this.apiUrl}/staff/${staffIds.join(',')}`, { params });
  }
  


  get week(): AvailabilityDayDto[] {
    return [
      { id: 0, dayOfWeek: 0, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 1, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 2, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 3, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 4, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 5, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },
      { id: 0, dayOfWeek: 6, startTime: '', startBreak: '', endBreak: '', endTime: '', staffId: 0, shopId: 0 },

    ]
  }

  update(id: number, updateAvailability: UpdateAvailabilityDto) {
    return this.http.patch(`${this.apiUrl}/${id}`, updateAvailability)
  }

  deleteMany(staffId: number) {
    return this.http.delete(`${this.apiUrl}/${staffId}`)
  }

  getWorkingHours(shopId: number) {
    const options = { params: { shopId: shopId } }
    return this.http.get(`${this.apiUrl}/shop/${this.shopStore.shopId}`, options)
  }
}
