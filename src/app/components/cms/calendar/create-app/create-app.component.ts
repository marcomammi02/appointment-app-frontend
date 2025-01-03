import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf, NgIf} from "@angular/common";
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
import {ErrorService} from "../../../../services/error.service";
import {CreateAppointmentDto} from "../../../../dtos/appointments.dto";
import {AppointmentService} from "../../../../services/appointment.service";
import {map, Observable, of, switchMap} from "rxjs";
import {toDateTime} from "../../../../services/utility.service";
import { LoadingComponent } from "../../../global/loading/loading.component";
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-create-app',
  standalone: true,
  imports: [
    CalendarModule,
    CancelBtnComponent,
    FloatLabelModule,
    InputTextModule,
    PaginatorModule,
    PrimaryBtnComponent,
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    LoadingComponent,
    InputTextareaModule
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

  creating: boolean = false
  duration: number = 0
  loading: boolean = true

  endTime?: string

  ngOnInit() {
    if (!this.appointmentStore.currentStaff.id) {
      this.router.navigate([`/private/${this.shopStore.slug}/appointments`])
    }
    this.buildForm()
    this.getServices()
    this.getStaff()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: [''],
      phone: [''],
      email: [''],
      notes: [''],
      service: [null, Validators.required],
      staff: [this.appointmentStore.currentStaff, Validators.required],
      startTime: [this.appointmentStore.currentHour, Validators.required],
      duration: [this.findDuration(this.duration), Validators.required],
      day: [this.appointmentStore.currentDay, Validators.required]
    })
  }

  findDuration(duration: number) {
    return this.servicesStore.durations.find(d => d.minutes == duration)
  }


  getServiceDuration(service: any) {
    this.form.patchValue({
      duration: this.findDuration(service.duration),
    })

    this.getEndtime(this.form.value.startTime, this.form.value.service, this.form.value.duration)
  }

  getEndtime(startTime: string, service: any, duration: any): Observable<string> {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;

    const serviceDuration = service.duration;
    const endMinutes = duration ? startMinutes + duration.minutes : startMinutes + serviceDuration;

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    this.endTime = formattedEndTime
    return of(formattedEndTime);
  }

  async getServices() {
    return this.servicesService.getServices().subscribe(res => {
      this.servicesStore.services = res
    })
  }

  async getStaff() {
    return this.staffService.getStaff().subscribe({
      next: (res) => {
      this.staffStore.staffList = res
      this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }

  create() {
    if (this.creating) return


    if (this.form.invalid) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      });
      return;
    }

    this.creating = true

    this.shopStore.transparentLoading = true

    const v = this.form.value;
    console.log(v.service)

    this.getEndtime(v.startTime, v.service, v.duration).pipe(
      switchMap(endTime => {
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
          shopId: this.shopStore.shopId
        };

        return this.appointmentService.create(appointment);
      })
    ).subscribe(
      () => {
        this.router.navigate([`/private/${this.shopStore.slug}/appointments`])
        this.shopStore.transparentLoading = false
      },
      err => {
        this.errorService.showError({
          label: 'Errore',
          message: ''
        });
        this.creating = false
        this.shopStore.transparentLoading = false
      }
    );
  }
}
