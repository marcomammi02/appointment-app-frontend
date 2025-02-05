import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../global/loading/loading.component';
import { ShopStore } from '../../../../stores/shop.store';
import { NgIf, NgStyle } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicesStore } from '../../../../stores/services.store';
import {
  capitalizeFirstLetter,
  formatDateToStringDayFirst,
  getDayOfWeek,
  toDateTime,
} from '../../../../services/utility.service';
import { Location } from '@angular/common';
import { StoreAppointments } from '../../../../stores/appointment.store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryBtnComponent } from '../../../global/primary-btn/primary-btn.component';
import { ErrorService } from '../../../../services/error.service';
import { CreateAppointmentDto } from '../../../../dtos/appointments.dto';
import { AppointmentService } from '../../../../services/appointment.service';
import { EmailData, EmailService } from '../../../../services/email.service';
import { StaffService } from '../../../../services/staff.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    RouterModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    PrimaryBtnComponent,
    NgStyle
  ],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.scss',
})
export class DataPageComponent implements OnInit {
  constructor(
    public shopStore: ShopStore,
    public storeService: ServicesStore,
    private location: Location,
    public storeAppointments: StoreAppointments,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private appointmentService: AppointmentService,
    private router: Router,
    private emailService: EmailService,
    private staffService: StaffService
  ) {}

  loading: boolean = false;

  form!: FormGroup;

  creating: boolean = false;

  ngOnInit(): void {
    this.goBack();
    this.buildForm();
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`;
    if (hours > 0 && min == 0) return `${hours} h`;
    return `${hours} h ${min} min`;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, ValidationService.phoneValidator]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
    });
  }

  goBack() {
    if (!this.shopStore.currentShop.id) {
      this.location.back();
    }
  }

  async create(): Promise<void> {
    if (this.creating) return;

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

    this.creating = true;
    this.shopStore.transparentLoading = true;

    const v = this.form.value;

    try {
      // Attendi il nome dello staff
      const staffName = await this.getStaffName(
        this.storeAppointments.currentStaffId
      );

      const appointment: CreateAppointmentDto = {
        customerName: v.name,
        customerLastName: v.lastName,
        customerPhone: v.phone,
        customerEmail: v.email,
        notes: '',
        startTime: toDateTime(
          this.storeAppointments.currentDay,
          this.storeAppointments.currentHour
        ),
        endTime: toDateTime(
          this.storeAppointments.currentDay,
          this.storeAppointments.currentEndHour
        ),
        status: 'BOOKED_FROM_PUBLIC',
        serviceName: this.storeService.currentService.name,
        serviceId: this.storeService.currentService.id,
        serviceColor: this.storeService.currentService.color,
        staffId: this.storeAppointments.currentStaffId,
        shopId: this.shopStore.shopId,
      };

      const variablesForCustomer = {
        customerName: v.name,
        businessName: this.shopStore.currentShop.name,
        appointmentDate: formatDateToStringDayFirst(
          this.storeAppointments.currentDay
        ),
        appointmentTime: this.storeAppointments.currentHour,
        serviceName: this.storeService.currentService.name,
        businessEmail: this.shopStore.currentShop.email,
        businessPhone: this.shopStore.currentShop.phoneNumber,
        staffName: staffName,
      };

      const emailData: EmailData = {
        type: 'CONFIRM_APP_FOR_CLIENT',
        recipientEmail: v.email,
        subject: 'Appuntamento confermato!',
        variables: variablesForCustomer,
      };

      const emailDataForShop: EmailData = {
        type: 'CONFIRM_APP_FOR_SHOP',
        recipientEmail: this.shopStore.currentShop.email,
        subject: 'Nuovo appuntamento prenotato!',
        variables: {
          customerName: `${v.lastName} ${v.name}`,
          businessName: this.shopStore.currentShop.name,
          appointmentDate: formatDateToStringDayFirst(
            this.storeAppointments.currentDay
          ),
          appointmentTime: this.storeAppointments.currentHour,
          serviceName: this.storeService.currentService.name,
          businessEmail: this.shopStore.currentShop.email,
          businessPhone: this.shopStore.currentShop.phoneNumber,
          staffName: staffName,
          customerEmail: v.email,
          customerPhone: v.phone,
        },
      };

      // Creazione appuntamento
      const createdAppointment: any = await this.appointmentService.create(appointment).toPromise();
      console.log('Appointment created');
      const appointmentId = createdAppointment!.id; // Assumendo che la risposta contenga l'ID

      // Invio email
      this.emailService.sendEmail(emailData).subscribe();
      this.emailService.sendEmail(emailDataForShop).subscribe();

      this.router.navigate([
        '/' +
          this.shopStore.currentShop.id +
          '/service/' +
          this.storeService.currentService.id +
          '/datas/confirm',
      ]);
    } catch (error) {
      console.error('Errore durante la creazione:', error);
      this.errorService.showError({
        label: 'Errore',
        message:
          "Scegli un'altro orario, qualcuno ti ha appena rubato il posto!",
      });
    } finally {
      this.creating = false;
      this.shopStore.transparentLoading = false;
    }
  }


  async getStaffName(staffId: number): Promise<string> {
    const res: any = await this.staffService.getDetail(staffId).toPromise();
    return res.name;
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly formatDateToStringDayFirst = formatDateToStringDayFirst;
  protected readonly getDayOfWeek = getDayOfWeek;
}
