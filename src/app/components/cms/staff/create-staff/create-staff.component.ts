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
    public availabilityStore: AvailabilityStore
  ) {
  }

  form!: FormGroup

  minDate!: Date;

  ngOnInit() {
    this.minDate = new Date()
    this.minDate.setHours(12, 0, 0)
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: [''],
      role: [''],
    })
  }

  setStartWork(day: string, event: any) {
    console.log('Il ' + day + ' inizia a lavorare alle ' + this.getTime(event))
  }

  setStartBreak(day: string, event: any) {
    console.log('Il ' + day + ' inizia la pausa alle ' + this.getTime(event))
  }

  setEndBreak(day: string, event: any) {
    console.log('Il ' + day + ' finisce la pausa alle ' + this.getTime(event))
  }

  setEndWork(day: string, event: any) {
    console.log('Il ' + day + ' finisce di lavorare alle ' + this.getTime(event))
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
