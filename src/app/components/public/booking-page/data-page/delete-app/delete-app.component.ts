import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../../../services/appointment.service';
import { catchError, of } from 'rxjs';
import { NgIf, NgStyle } from '@angular/common';
import { ShopStore } from '../../../../../stores/shop.store';
import { capitalizeFirstLetter, formatDateToStringDayFirst, getDayOfWeek, getTime } from '../../../../../services/utility.service';
import { ShopService } from '../../../../../services/shop.service';
import { DeleteBtnComponent } from "../../../../global/delete-btn/delete-btn.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmailData, EmailService } from '../../../../../services/email.service';
import { StaffService } from '../../../../../services/staff.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoadingComponent } from "../../../../global/loading/loading.component";

@Component({
  selector: 'app-delete-app',
  standalone: true,
  imports: [
    NgStyle,
    DeleteBtnComponent,
    RouterModule,
    DeleteBtnComponent,
    ConfirmDialogModule,
    LoadingComponent,
    NgIf
],
  templateUrl: './delete-app.component.html',
  styleUrl: './delete-app.component.scss',
  providers: [ConfirmationService, MessageService],

})
export class DeleteAppComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    public shopStore: ShopStore,
    private shopService: ShopService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService,
    private staffService: StaffService

  ) {}

  app: any = {};

  staff: any = {};

  loading: boolean = true

  ngOnInit() {
    this.extractAppointmentIdFromUrl();
  }

  extractAppointmentIdFromUrl() {
    const appId = this.route.snapshot.paramMap.get('appointmentId');

    if (!appId) {
      console.error('Nessun appointmentId trovato nella route');
      return;
    }

    this.appointmentService
      .getDetail(+appId)
      .pipe(
        catchError((error) => {
          console.error("Errore durante il recupero dell'appuntamento", error);
          this.router.navigate(['/']);
          return of(null); // Restituisce un valore nullo per evitare che il flusso si interrompa
        })
      )
      .subscribe((res: any) => {
        this.app = res;
        console.log(this.app);

        this.shopStore.shopId = res.shopId
        this.shopService.getShop()
        this.staffService.getDetail(res.staffId).subscribe((res: any) => {
          this.staff = res
          this.loading = false
        })

      });
  }

  confirm2(event: Event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Sei sicuro di voler eliminare l'appuntamento?",
        header: 'Attenzione',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-text',
        acceptLabel: 'Si',
        rejectButtonStyleClass: 'p-button-text p-button-text',
        rejectLabel: 'No',
        acceptIcon: 'none',
        rejectIcon: 'none',

        accept: () => {
          this.delete();
        },
      });
    }

    delete() {
      return this.appointmentService
        .delete(this.app.id)
        .subscribe((res) => {

          const emailData: EmailData = {
            type: 'DELETE_APP_FOR_CLIENT',
            recipientEmail: this.app.customerEmail,
            subject: 'Appuntamento cancellato!',
            variables: {
              customerName: this.app.customerName,
              businessName: this.shopStore.currentShop.name,
              appointmentDate: formatDateToStringDayFirst(this.app.startTime),
              appointmentTime: getTime(this.app.startTime),
              serviceName: this.app.serviceName,
              businessEmail: this.shopStore.currentShop.email,
              businessPhone: this.shopStore.currentShop.phoneNumber,
              staffName: this.staff.name
            },
          };
          this.emailService.sendEmail(emailData).subscribe();
          this.router.navigate([`/${this.shopStore.slug}`]);
        });
    }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly formatDateToStringDayFirst = formatDateToStringDayFirst;
  protected readonly getDayOfWeek = getDayOfWeek;
  protected readonly getTime = getTime
}
