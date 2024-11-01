import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {PrimeTemplate} from "primeng/api";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ShopStore} from "../../../../stores/shop.store";
import {Router, RouterLink} from "@angular/router";
import {ServicesService} from "../../../../services/services.service";
import {ServicesStore} from "../../../../stores/services.store";
import {StaffService} from "../../../../services/staff.service";
import {StaffStore} from "../../../../stores/staff.store";
import {StoreAppointments} from "../../../../stores/appointment.store";
import {ErrorService, MyError} from "../../../../services/error.service";
import {CreateAppointmentDto} from "../../../../dtos/appointments.dto";
import {AppointmentService} from "../../../../services/appointment.service";
import {map, Observable, switchMap} from "rxjs";
import {toDateTime} from "../../../../services/utility.service";

@Component({
  selector: 'app-create-app',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    CancelBtnComponent,
    FloatLabelModule,
    InputTextModule,
    NgForOf,
    PaginatorModule,
    PrimaryBtnComponent,
    PrimeTemplate,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss'
})
export class CreateAppComponent implements OnInit{
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
    private appointmentService: AppointmentService
  ) {
  }

  form!: FormGroup
  day!: Date

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
      service: [null, Validators.required],
      staff: [this.appointmentStore.currentStaff],
      startTime: [this.appointmentStore.currentHour],
      day: [this.appointmentStore.currentDay]
    })
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

  create() {
    if (this.form.invalid) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      });
      return;
    }

    const v = this.form.value;
    console.log(v.service)

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

        return this.appointmentService.create(appointment);
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
}
