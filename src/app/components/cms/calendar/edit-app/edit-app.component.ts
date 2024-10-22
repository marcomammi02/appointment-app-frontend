import {Component, OnInit} from '@angular/core';
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {DropdownModule} from "primeng/dropdown";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ShopStore} from "../../../../stores/shop.store";
import {ServicesService} from "../../../../services/services.service";
import {ServicesStore} from "../../../../stores/services.store";
import {StaffService} from "../../../../services/staff.service";
import {StaffStore} from "../../../../stores/staff.store";
import {StoreAppointments} from "../../../../stores/appointment.store";
import {ErrorService} from "../../../../services/error.service";
import {Router, RouterLink} from "@angular/router";
import {AppointmentService} from "../../../../services/appointment.service";
import {map, Observable, switchMap} from "rxjs";
import {CreateAppointmentDto} from "../../../../dtos/appointments.dto";
import {capitalizeFirstLetter, toDateTime} from "../../../../services/utility.service";
import {DeleteBtnComponent} from "../../../global/delete-btn/delete-btn.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CalendarModule} from "primeng/calendar";

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
    CalendarModule
  ],
  templateUrl: './edit-app.component.html',
  styleUrl: './edit-app.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class EditAppComponent implements OnInit{
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
  ) {
  }

  form!: FormGroup

  ngOnInit() {
    this.buildForm()
    this.getServices()
    this.getStaff()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      service: ['', Validators.required],
      staff: [this.appointmentStore.currentStaff],
      startTime: [this.appointmentStore.currentHour],
      day: [this.appointmentStore.currentDay]
    });

    const app = this.appointmentStore.currentApp;

    this.servicesService.getDetail(app.serviceId).subscribe(res => {
      const service = res;

      this.form.patchValue({
        name: app.customerName,
        lastName: app.customerLastName,
        phone: app.customerPhone,
        email: app.customerEmail,
        service: service,
        staffId: this.appointmentStore.currentStaff,
        startTime: this.appointmentStore.currentHour,
        day: this.appointmentStore.currentDay
      });
    });
  }

  getEndtime(startTime: string, serviceId: number): Observable<string> {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;

    return this.servicesService.getDetail(serviceId).pipe(
      map((res: any) => {
        const duration = res.duration;
        const endMinutes = startMinutes + duration;

        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

        return formattedEndTime;
      })
    );
  }

  getServices() {
    this.servicesService.getServices().subscribe(res => {
      this.servicesStore.services = res
    })
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.staffStore.staffList = res
    })
  }

  edit() {
    if (this.form.invalid) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      });
      return;
    }

    const v = this.form.value;

    this.getEndtime(v.startTime, v.service.id).pipe(
      switchMap(endTime => {
        const appointment: CreateAppointmentDto = {
          customerName: v.name,
          customerLastName: v.lastName,
          customerPhone: v.phone,
          customerEmail: v.email,
          startTime: toDateTime(v.day, v.startTime),
          endTime: toDateTime(v.day, endTime),
          status: 'BOOKED',
          serviceName: v.service.name,
          serviceId: v.service.id,
          serviceColor: v.service.color,
          staffId: v.staff.id,
          shopId: this.shopStore.shopId
        };

        return this.appointmentService.update(this.appointmentStore.currentApp.id, appointment);
      })
    ).subscribe(
      () => this.router.navigate([`/private/${this.shopStore.shopId}/appointments`]),
      err => {
        this.errorService.showError({
          label: 'Errore',
          message: err.message
        });
      }
    );
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare l\'appuntamento?',
      header: 'Attenzione',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      acceptLabel: 'Si',
      rejectButtonStyleClass:"p-button-text p-button-text",
      rejectLabel: 'No',
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.delete()
      }
    });
  }

  delete() {
   return this.appointmentService.delete(this.appointmentStore.currentApp.id).subscribe(res => {
      this.router.navigate([`/private/${this.shopStore.shopId}/appointments`])
     }
   )
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}

