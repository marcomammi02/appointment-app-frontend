import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailData {
  customerEmail: string;
  subject: string;
  variables: {};
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  private readonly apiUrl: string = environment.apiUrl + '/email/send'

  sendEmail(emailData: EmailData): Observable<any> {
    console.log('Sending email')
    console.log(emailData)
    return this.http.post(this.apiUrl, emailData);
  }
}
