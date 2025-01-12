import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type EmailType =
  | 'CONFIRM_APP_FOR_CLIENT'
  | 'CONFIRM_APP_FOR_SHOP'
  | 'EDIT_APP_FOR_CLIENT'
  | 'DELETE_APP_FOR_CLIENT'
  | 'REMINDER_APP_FOR_CLIENT';

export interface EmailData {
  type: EmailType;
  recipientEmail: string;
  subject: string;
  variables: {};
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  private readonly apiUrl: string = environment.apiUrl + '/email/send';
  private readonly scheduleReminderUrl: string =
    environment.apiUrl + '/email/schedule-reminder';

  // Funzione per inviare una email immediatamente
  sendEmail(emailData: EmailData): Observable<any> {
    if (!environment.sendEmail) {
      console.log('Email sender disabled');
      return new Observable((observer) => {
        observer.complete();
      });
    }

    console.log('Sending email: ' + emailData);
    return this.http.post(this.apiUrl, emailData);
  }

  // Funzione per pianificare l'invio del promemoria 24 ore prima
  scheduleReminderEmail(
    appointmentDate: string,
    recipientEmail: string,
    appointmentId: number,
    variables: Record<string, string>
  ): Observable<any> {
    const emailData: EmailData = {
      type: 'REMINDER_APP_FOR_CLIENT',
      recipientEmail,
      subject: 'Promemoria: Appuntamento di domani',
      variables,
    };

    // Pianifica l'invio del promemoria 24 ore prima
    const requestData = {
      appointmentDate, // data dell'appuntamento
      recipientEmail, // email destinatario
      variables, // variabili per personalizzare l'email
      appointmentId
    };

    console.log('Scheduling reminder email:', requestData);
    return this.http.post(this.scheduleReminderUrl, requestData);
  }
}
