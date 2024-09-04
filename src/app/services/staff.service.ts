import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StaffStore} from "../stores/staff.store";
import {CreateStaffDto} from "../dtos/staff.dto";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private http: HttpClient, private staffStore: StaffStore) {}

  private apiUrl: string = 'http://localhost:3000/staff'

  getStaff() {
    return this.http.get(this.apiUrl);
  }

  create(staff: CreateStaffDto) {
    return this.http.post(this.apiUrl, staff)
  }

}
