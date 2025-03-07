import { Component, OnInit } from '@angular/core';
import { CancelBtnComponent } from '../../../global/cancel-btn/cancel-btn.component';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PrimaryBtnComponent } from '../../../global/primary-btn/primary-btn.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShopStore } from '../../../../stores/shop.store';
import { ServicesService } from '../../../../services/services.service';
import { ServicesStore } from '../../../../stores/services.store';
import { StaffService } from '../../../../services/staff.service';
import { StaffStore } from '../../../../stores/staff.store';
import { StoreAppointments } from '../../../../stores/appointment.store';
import { ErrorService } from '../../../../services/error.service';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../../services/appointment.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { CreateAppointmentDto } from '../../../../dtos/appointments.dto';
import {
  capitalizeFirstLetter,
  formatDateToStringDayFirst,
  toDateTime,
} from '../../../../services/utility.service';
import { DeleteBtnComponent } from '../../../global/delete-btn/delete-btn.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { LoadingComponent } from '../../../global/loading/loading.component';
import { NgIf } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EmailData, EmailService } from '../../../../services/email.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-edit-app',
  standalone: true,
  imports: [
    CancelBtnComponent,
    DropdownModule,
    FloatLabelModule,
    InputTextModule,
    PaginatorModule,
    PrimaryBtnComponent,
    ReactiveFormsModule,
    RouterLink,
    DeleteBtnComponent,
    ConfirmDialogModule,
    CalendarModule,
    LoadingComponent,
    NgIf,
    InputTextareaModule,
  ],
  templateUrl: './edit-app.component.html',
  styleUrl: './edit-app.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class EditAppComponent implements OnInit {
  constructor(
    public shopStore: ShopStore,
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    public servicesStore: ServicesStore,
    private staffService: StaffService,
    public staffStore: StaffStore,
    public appointmentStore: StoreAppointments,
    private errorService: ErrorService,
    private router: Router,
    private appointmentService: AppointmentService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService
  ) {}

  form!: FormGroup;

  editing: boolean = false;

  duration: number = 0;

  loading: boolean = true;

  endTime?: string;

  emailData?: EmailData;

  ngOnInit() {
    this.buildForm();
    this.getServices();
    this.getStaff();
  }

  async buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: [''],
      phone: ['', ValidationService.phoneValidator],
      email: ['', ValidationService.emailValidator],
      notes: [''],
      service: ['', Validators.required],
      staff: [this.appointmentStore.currentStaff, Validators.required],
      duration: [this.findDuration(this.duration), Validators.required],
      startTime: [this.appointmentStore.currentHour, Validators.required],
      day: [this.appointmentStore.currentDay, Validators.required],
    });

    const app = this.appointmentStore.currentApp;
    console.log(app);
    if (!app.id) {
      this.router.navigate([`/private/${this.shopStore.slug}/appointments`]);
      return;
    }

    this.servicesService.getDetail(app.serviceId).subscribe({
      next: (res) => {
        const service = res;
        console.log(app);

        this.form.patchValue({
          name: app.customerName,
          lastName: app.customerLastName,
          phone: app.customerPhone,
          email: app.customerEmail,
          notes: app.notes,
          service: service,
          duration: this.findDuration(
            this.getDurationFromAppData(app.startTime, app.endTime)
          ),
          staffId: this.appointmentStore.currentStaff,
          startTime: this.appointmentStore.currentHour,
          day: this.appointmentStore.currentDay,
        });

        this.getEndtime(
          this.form.value.startTime,
          this.form.value.service,
          this.form.value.duration
        );
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  findDuration(duration: number) {
    return this.servicesStore.durations.find((d) => d.minutes == duration);
  }

  // Return duration froma startTime and endTime
  getDurationFromAppData(startTime: any, endTime: any): number {
    // Converti i valori in oggetti Date, se non lo sono già
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);

    // Controlla che i valori siano validi
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error(
        'Invalid Date: startTime and endTime must be valid Date objects or strings'
      );
    }

    // Calcola la differenza in millisecondi
    const durationMs = end.getTime() - start.getTime();

    // Converti i millisecondi in minuti
    const durationMinutes = durationMs / (1000 * 60);

    return Math.max(0, durationMinutes); // Ritorna almeno 0 per evitare durate negative
  }

  getServiceDuration(service: any) {
    this.form.patchValue({
      duration: this.findDuration(service.duration),
    });

    this.getEndtime(
      this.form.value.startTime,
      this.form.value.service,
      this.form.value.duration
    );
  }

  getEndtime(
    startTime: string,
    service: any,
    duration: any
  ): Observable<string> {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;

    const serviceDuration = service.duration;
    const endMinutes = duration
      ? startMinutes + duration.minutes
      : startMinutes + serviceDuration;

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(
      endMins
    ).padStart(2, '0')}`;

    this.endTime = formattedEndTime;
    return of(formattedEndTime);
  }

  getServices() {
    this.servicesService.getServices().subscribe((res) => {
      this.servicesStore.services = res;
    });
  }

  getStaff() {
    this.staffService.getStaff().subscribe((res) => {
      this.staffStore.staffList = res;
    });
  }

  edit() {
    if (this.editing) return;

    if (this.form.invalid) {
      const emailControl = this.form.controls['email'];
      const phoneControl = this.form.controls['phone'];

      if (emailControl.errors?.['invalidEmail']) {
        this.errorService.showError({
          label: 'Attenzione',
          message: 'Email non valida',
        });
        return;
      }

      if (phoneControl.errors?.['invalidPhone']) {
        this.errorService.showError({
          label: 'Attenzione',
          message: 'Numero di telefono non valido',
        });
        return;
      }

      // Controllo se ci sono campi vuoti
      const emptyFields = Object.keys(this.form.controls).some(
        (key) => !this.form.controls[key].value
      );

      if (emptyFields) {
        this.errorService.showError({
          label: 'Attenzione',
          message: 'Inserire tutti i campi',
        });
        return;
      }
    }

    this.editing = true;
    this.shopStore.transparentLoading = true;

    const v = this.form.value;

    this.getEndtime(v.startTime, v.service, v.duration)
      .pipe(
        switchMap((endTime) => {
          const appointment: CreateAppointmentDto = {
            customerName: v.name,
            customerLastName: v.lastName,
            customerPhone: v.phone,
            customerEmail: v.email,
            notes: v.notes,
            startTime: toDateTime(v.day, v.startTime),
            endTime: toDateTime(v.day, endTime),
            status: 'BOOKED',
            serviceName: v.service.name,
            serviceId: v.service.id,
            serviceColor: v.service.color,
            staffId: v.staff.id,
            shopId: this.shopStore.shopId,
          };

          this.emailData = {
            type: 'EDIT_APP_FOR_CLIENT',
            recipientEmail: v.email,
            subject: 'Appuntamento modificato!',
            variables: {
              customerName: v.name,
              businessName: this.shopStore.currentShop.name,
              appointmentDate: formatDateToStringDayFirst(v.day),
              appointmentTime: v.startTime,
              serviceName: v.service.name,
              businessEmail: this.shopStore.currentShop.email,
              businessPhone: this.shopStore.currentShop.phoneNumber,
              staffName: v.staff.name,
              businessSlug: this.shopStore.slug,
              appointmentId: this.appointmentStore.currentApp.id,
            },
          };

          return this.appointmentService.update(
            this.appointmentStore.currentApp.id,
            appointment
          );
        })
      )
      .subscribe(
        () => {
          this.editing = false;
          this.shopStore.transparentLoading = false;
          this.emailService.sendEmail(this.emailData!).subscribe();
          this.router.navigate([
            `/private/${this.shopStore.slug}/appointments`,
          ]);
        },
        (err) => {
          this.errorService.showError({
            label: 'Errore',
            message: err.message,
          });
          this.editing = false;
        }
      );
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
      .delete(this.appointmentStore.currentApp.id)
      .subscribe((res) => {
        const v = this.form.value;

        const emailData: EmailData = {
          type: 'DELETE_APP_FOR_CLIENT',
          recipientEmail: v.email,
          subject: 'Appuntamento cancellato!',
          variables: {
            customerName: v.name,
            businessName: this.shopStore.currentShop.name,
            appointmentDate: formatDateToStringDayFirst(v.day),
            appointmentTime: v.startTime,
            serviceName: v.service.name,
            businessEmail: this.shopStore.currentShop.email,
            businessPhone: this.shopStore.currentShop.phoneNumber,
            staffName: v.staff.name
          },
        };
        this.emailService.sendEmail(emailData).subscribe();
        this.router.navigate([`/private/${this.shopStore.slug}/appointments`]);
      });
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
