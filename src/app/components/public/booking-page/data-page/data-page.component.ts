import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../../global/loading/loading.component";
import { ShopStore } from '../../../../stores/shop.store';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ServicesStore } from '../../../../stores/services.store';
import { capitalizeFirstLetter, formatDateToStringDayFirst, getDayOfWeek, toDateTime } from '../../../../services/utility.service';
import { Location } from '@angular/common';
import { StoreAppointments } from '../../../../stores/appointment.store';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryBtnComponent } from "../../../global/primary-btn/primary-btn.component";
import { ErrorService } from '../../../../services/error.service';
import { CreateAppointmentDto } from '../../../../dtos/appointments.dto';
import { AppointmentService } from '../../../../services/appointment.service';
import { EmailData, EmailService } from '../../../../services/email.service';



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
    PrimaryBtnComponent
],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.scss'
})
export class DataPageComponent implements OnInit{
  constructor(
    public shopStore: ShopStore,
    public storeService: ServicesStore,
    private location: Location,
    public storeAppointments: StoreAppointments,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private appointmentService: AppointmentService,
    private router: Router,
    private emailService: EmailService
  ) {}

  loading: boolean = false

  form!: FormGroup

  creating: boolean = false

  ngOnInit(): void {
    this.goBack()
    this.buildForm()
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required]
    })
  }

  goBack() {
    if (!this.shopStore.currentShop.id) {
      this.location.back()
    }
  }

  create() {
    if (this.creating) return null

    if (this.form.invalid) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      });
      return null
    }

    this.creating = true
    this.shopStore.transparentLoading = true

    const v = this.form.value

    const appointment: CreateAppointmentDto = {
      customerName: v.name,
      customerLastName: v.lastName,
      customerPhone: v.phone,
      customerEmail: v.email,
      notes: "",
      startTime: toDateTime(this.storeAppointments.currentDay, this.storeAppointments.currentHour),
      endTime: toDateTime(this.storeAppointments.currentDay, this.storeAppointments.currentEndHour),
      status: 'BOOKED',
      serviceName: this.storeService.currentService.name,
      serviceId: this.storeService.currentService.id,
      serviceColor: this.storeService.currentService.color,
      staffId: this.storeAppointments.currentStaffId,
      shopId: this.shopStore.shopId
    };
    console.log(appointment)

    const emailData: EmailData = {
      type: 'CONFIRM_APP_FOR_CLIENT',
      recipientEmail: v.email,
      subject: 'Appuntamento confermato!',
      variables: {
        customerName: v.name,
        businessName: this.shopStore.currentShop.name,
        appointmentDate: formatDateToStringDayFirst(this.storeAppointments.currentDay),
        appointmentTime: this.storeAppointments.currentHour,
        serviceName: this.storeService.currentService.name,
        businessEmail: this.shopStore.currentShop.email,
        businessPhone: this.shopStore.currentShop.phoneNumber
      }
    }

    const emailDataForShop: EmailData = {
      type: 'CONFIRM_APP_FOR_SHOP',
      recipientEmail: this.shopStore.currentShop.email,
      subject: 'Nuovo appuntamento prenotato!',
      variables: {
        customerName: v.name,
        businessName: this.shopStore.currentShop.name,
        appointmentDate: formatDateToStringDayFirst(this.storeAppointments.currentDay),
        appointmentTime: this.storeAppointments.currentHour,
        serviceName: this.storeService.currentService.name,
        businessEmail: this.shopStore.currentShop.email,
        businessPhone: this.shopStore.currentShop.phoneNumber
      }
    }

    return this.appointmentService.create(appointment).subscribe(
      res => {
        console.log('Appointment created')
        this.shopStore.transparentLoading = false
        this.emailService.sendEmail(emailData).subscribe()
        this.emailService.sendEmail(emailDataForShop).subscribe()
        this.router.navigate(['/' + this.shopStore.currentShop.id + '/service/' + this.storeService.currentService.id + '/datas/confirm'])
      },
      err => {
        this.errorService.showError({
          label: 'Errore',
          message: 'Scegli un\'altro orario, qualcuno ti ha appena rubato il posto!'
        });
        this.creating = false
        this.shopStore.transparentLoading = false
      }
    );
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly formatDateToStringDayFirst = formatDateToStringDayFirst;
  protected readonly getDayOfWeek = getDayOfWeek;
}
