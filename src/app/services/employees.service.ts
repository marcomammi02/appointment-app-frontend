import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export interface CreateEmployee {
  name: string
  lastname: string
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/employees'

  getEmployees() {
    return this.http.get(this.apiUrl)
  }

  create(employee: CreateEmployee) {
    return this.http.post(`${this.apiUrl}/create`, employee)
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
