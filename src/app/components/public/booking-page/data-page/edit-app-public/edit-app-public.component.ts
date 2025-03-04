import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AppointmentService } from '../../../../../services/appointment.service';

@Component({
  selector: 'app-edit-app-public',
  standalone: true,
  imports: [],
  templateUrl: './edit-app-public.component.html',
  styleUrl: './edit-app-public.component.scss'
})
export class EditAppPublicComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  app: any = {}

  ngOnInit() {
    this.extractAppointmentIdFromUrl()
  }

  extractAppointmentIdFromUrl() {
    const appId = this.route.snapshot.paramMap.get('appointmentId');
    
    if (!appId) {
      console.error('Nessun appointmentId trovato nella route');
      return;
    }

    this.appointmentService.getDetail(+appId).pipe(
      catchError(error => {
        console.error('Errore durante il recupero dell\'appuntamento', error);
        this.router.navigate(['/'])
        return of(null); // Restituisce un valore nullo per evitare che il flusso si interrompa
      })
    ).subscribe(res => {
      this.app = res;
      console.log(this.app)
    });
  }
}
