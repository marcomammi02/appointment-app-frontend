import {Component, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ErrorService, MyError} from "../../../../services/error.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {capitalizeFirstLetter} from "../../../../services/utility.service";
import {DeleteBtnComponent} from "../../../global/delete-btn/delete-btn.component";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {StaffService} from "../../../../services/staff.service";
import {UpdateStaffDto} from "../../../../dtos/staff.dto";
import {Calendar, CalendarModule} from "primeng/calendar";
import {AvailabilityStore} from "../../../../stores/availability.store";
import {AvailabilityService} from "../../../../services/availability.service";
import {AvailabilityDayDto, CreateAvailabilityDto, UpdateAvailabilityDto} from "../../../../dtos/availability.dto";
import {ShopStore} from "../../../../stores/shop.store";


@Component({
  selector: 'app-edit-staff',
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
        NgIf,
        DeleteBtnComponent,
        ToastModule,
        ConfirmDialogModule,
        CalendarModule,
        NgForOf,
    ],
  templateUrl: './edit-staff.component.html',
  styleUrl: './edit-staff.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class EditStaffComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private staffService: StaffService,
    public availabilityStore: AvailabilityStore,
    private availabilityService: AvailabilityService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public shopStore: ShopStore
  ) {
  }

  form!: FormGroup

  currentStaff?: any

  staffId!: number

  minDate!: Date;

  week: AvailabilityDayDto[] = []

  ngOnInit() {
    this.week = this.availabilityService.week
    this.route.paramMap.subscribe(params => {
      const id = params.get('staffId');
      this.staffId = +id!;

      if (id) {
        this.getDetail(+id);
        this.availabilityService.findAll(this.staffId).subscribe((res: AvailabilityDayDto[]) => {
          res.forEach(av => {
            this.week[av.dayOfWeek] = {
              id: av.id,
              dayOfWeek: av.dayOfWeek,
              startTime: av.startTime,
              startBreak: av.startBreak,
              endBreak: av.endBreak,
              endTime: av.endTime,
              staffId: av.staffId
            }
          })
        });
      }
    });

    this.minDate = new Date();
    this.minDate.setHours(12, 0, 0);
  }

  async getDetail(id: number) {
    return this.staffService.getDetail(id).subscribe(res => {
      this.currentStaff = res;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: [capitalizeFirstLetter(this.currentStaff.name), Validators.required],
      lastName: [capitalizeFirstLetter(this.currentStaff.lastName)],
      role: [capitalizeFirstLetter(this.currentStaff.role)]
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
    }
  }

  setEndBreak(day: number, event: any) {
    if (this.week![day]){
      this.week![day].endBreak = this.getTime(event)
    }
  }

  setEndWork(day: number, event: any) {
    if (this.week![day]){
      this.week![day].endTime = this.getTime(event)
    }
  }

  clearInput(day: number, field: 'startTime' | 'startBreak' | 'endBreak' | 'endTime', calendar: Calendar) {
    if (this.week![day]) {
      this.week![day][field] = '';
      this.clearCalendar(calendar)
    }
  }

  clearCalendar(calendar: Calendar) {
    calendar.inputFieldValue = null;
    calendar.updateModel(null);
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

  update() {
    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Il nome è obbligatorio'
      }
      this.errorService.showError(error)
      return
    }

    let v = this.form.value
    const staff: UpdateStaffDto = {
      name: v.name,
      lastName: v.lastName,
      role: v.role
    }

    this.staffService.update(this.currentStaff.id, staff).subscribe(
      res => {
        this.availabilityStore.week.forEach(day => {
          const av: AvailabilityDayDto = this.week![day.value]
          if (av) {
            let updateAvailability: UpdateAvailabilityDto = {
              startTime: av.startTime,
              startBreak: av.startBreak ? av.startBreak : null,
              endBreak: av.endBreak ? av.endBreak : null,
              endTime: av.endTime!,
            }
            console.log(updateAvailability)
            this.availabilityService.update(av.id, updateAvailability).subscribe()
          }
        })
        this.router.navigate([`/private/${this.shopStore.shopId}/staff`])
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

  delete() {
    if (this.staffId != null) {
      this.staffService.delete(+this.staffId).subscribe(
        res => {
          this.router.navigate(['/private/staff'])
        },
        err => console.error(err.message)
      )
    }
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuro di voler eliminare il membro dello staff?',
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

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
