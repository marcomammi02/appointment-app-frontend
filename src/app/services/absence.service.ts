import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  private apiUrl: string = environment.apiUrl + '/blocked-times'

  constructor(private http: HttpClient) { }

  getAbsences(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAbsencesByStaffId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staff/${id}`);
  }

  getAbsencesByDay(day: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/day/${day}`);
  }

  getAbsencesByStaffAndDay(staffId: number[], day: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/staff/${staffId}/day/${day}`);
  }

  createAbsence(absence: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, absence);
  }

  updateAbsence(id: number, absence: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, absence);
  }

  deleteAbsence(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
