import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StaffStore} from "../stores/staff.store";
import {CreateStaffDto, StaffDto, UpdateStaffDto} from "../dtos/staff.dto";
import {UpdateServiceDto} from "../dtos/services.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private http: HttpClient, private staffStore: StaffStore) {}

  private apiUrl: string = 'http://localhost:3000/staff'

  getStaff() {
    return this.http.get(this.apiUrl);
  }

  create(staff: CreateStaffDto): Observable<any> {
    return this.http.post(this.apiUrl, staff)
  }

  getDetail(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(id: number, staff: UpdateStaffDto) {
    return this.http.patch(`${this.apiUrl}/${id}`, staff)
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
