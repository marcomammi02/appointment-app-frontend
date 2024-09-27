import {Component, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {NgClass, NgForOf} from "@angular/common";
import {ErrorService, MyError} from "../../../../services/error.service";
import {Router, RouterLink} from "@angular/router";
import {CreateStaffDto} from "../../../../dtos/staff.dto";
import {StaffService} from "../../../../services/staff.service";
import {AvailabilityStore} from "../../../../stores/availability.store";
import {CalendarModule} from "primeng/calendar";
import {AvailabilityDayDto, CreateAvailabilityDto} from "../../../../dtos/availability.dto";
import {AvailabilityService} from "../../../../services/availability.service";


@Component({
  selector: 'app-create-staff',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    PrimaryBtnComponent,
    CancelBtnComponent,
    NgClass,
    RouterLink,
    NgForOf,
    CalendarModule
  ],
  templateUrl: './create-staff.component.html',
  styleUrl: './create-staff.component.scss'
})
export class CreateStaffComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private router: Router,
    private staffService: StaffService,
    public availabilityStore: AvailabilityStore,
    private availabilityService: AvailabilityService
  ) {
  }

  form!: FormGroup

  minDate!: Date;

  week: AvailabilityDayDto[] = []

  ngOnInit() {
    this.minDate = new Date()
    this.minDate.setHours(12, 0, 0)
    this.buildForm()
    this.week = this.availabilityService.week
    console.log(this.week)
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: [''],
      role: [''],
    })
  }

  setStartWork(day: number, event: any) {
    if (this.week![day]){
      this.week![day].startTime = this.getTime(event)
    }
  }
  setStartBreak(day: number, event: any) {
    if (this.week![day]){
      this.week![day].startBreak = this.getTime(event)
    }  }

  setEndBreak(day: number, event: any) {
    if (this.week![day]){
      this.week![day].endBreak = this.getTime(event)
    }  }

  setEndWork(day: number, event: any) {
    if (this.week![day]){
      this.week![day].endTime = this.getTime(event)
    }  }

  checkIfEmpty(day: number, field: 'startTime' | 'startBreak' | 'endBreak' | 'endTime', value: string) {
    if (value === '') {
      if (this.week![day]) {
        this.week![day][field] = null;
        console.log(this.week![day][field])
      }
    }
  }

  getTime(date: Date) {
    let hours: number | string = date.getHours()
    let minutes: number | string = date.getMinutes()
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes == 0) {
      minutes = '00'
    }
    return `${hours}:${minutes}`
  }

  create() {
    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Il nome è obbligatorio'
      }
      this.errorService.showError(error)
      return
    }

    let v = this.form.value
    const staff: CreateStaffDto = {
      name: v.name,
      lastName: v.lastName,
      role: v.role,
      shopId: 3   // Example
    }

    this.staffService.create(staff).subscribe(
      res => {
        this.availabilityStore.week.forEach(day => {
          const av: AvailabilityDayDto = this.week![day.value]
          if (av) {
            let createAvailability: CreateAvailabilityDto = {
              dayOfWeek: av.dayOfWeek,
              startTime: av.startTime!,
              startBreak: av.startBreak ? av.startBreak : null,
              endBreak: av.endBreak ? av.endBreak : null,
              endTime: av.endTime!,
              staffId: res.id
            }
            this.availabilityService.create(createAvailability).subscribe()
          }
        })
        this.router.navigate(['/private/staff'])
      },
      err => {
        let error: MyError = {
          label: 'Errore',
          message: err.message
        }
        this.errorService.showError(error)
      }
    )
  }
}
