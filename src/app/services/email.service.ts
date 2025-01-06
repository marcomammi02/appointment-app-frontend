import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type EmailType =
  | 'CONFIRM_APP_FOR_CLIENT'
  | 'CONFIRM_APP_FOR_SHOP'
  | 'EDIT_APP_FOR_CLIENT'
  | 'DELETE_APP_FOR_CLIENT';

export interface EmailData {
  type: EmailType
  recipientEmail: string;
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
