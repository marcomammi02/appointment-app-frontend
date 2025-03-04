import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { AppointmentService } from '../../../../../services/appointment.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-delete-app',
  standalone: true,
  imports: [],
  templateUrl: './delete-app.component.html',
  styleUrl: './delete-app.component.scss'
})
export class DeleteAppComponent implements OnInit{

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
