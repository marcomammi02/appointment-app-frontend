import { Component } from '@angular/core';
import { LoadingComponent } from '../../../../../global/loading/loading.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StaffStore } from '../../../../../../stores/staff.store';
import { ShopStore } from '../../../../../../stores/shop.store';
import { capitalizeFirstLetter, getTime } from '../../../../../../services/utility.service';
import { NgIf } from '@angular/common';
import { StaffService } from '../../../../../../services/staff.service';
import { CancelBtnComponent } from '../../../../../global/cancel-btn/cancel-btn.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimaryBtnComponent } from '../../../../../global/primary-btn/primary-btn.component';
import {
  ErrorService,
  MyError,
} from '../../../../../../services/error.service';
import { CreateAbsenceDto } from '../../../../../../dtos/absences.dto';
import { AbsenceService } from '../../../../../../services/absence.service';

@Component({
  selector: 'app-create-abs',
  standalone: true,
  imports: [
    LoadingComponent,
    RouterModule,
    NgIf,
    CancelBtnComponent,
    ReactiveFormsModule,
    FloatLabelModule,
    CalendarModule,
    InputTextModule,
    CheckboxModule,
    PrimaryBtnComponent,
  ],
  templateUrl: './create-abs.component.html',
  styleUrl: './create-abs.component.scss',
})
export class CreateAbsComponent {
  constructor(
    public staffStore: StaffStore,
    public shopStore: ShopStore,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private absenceService: AbsenceService,
    private router: Router
  ) {}

  loading: boolean = true;

  staffId!: number;

  form!: FormGroup;

  today!: Date;

  minDate!: Date;

  creating: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('staffId');
      this.staffId = +id!;

      if (id) {
        this.getDetail(+id);
        this.today = new Date();
        this.minDate = new Date();
        this.minDate.setHours(12, 0, 0);
        this.buildForm();
      }
    });
  }

  async getDetail(id: number) {
    return this.staffService.getDetail(id).subscribe({
      next: (res) => {
        this.staffStore.currentStaff = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [null],
      allDay: [false],
      startTime: [''],
      endTime: [''],
      reason: [''],
    });
  }

  clearCalendar(calendar: Calendar) {
    calendar.inputFieldValue = null;
    calendar.updateModel(null);
  }

  toggleAllDay() {
    if (this.form.get('allDay')?.value) {
      this.form.get('startTime')?.disable();
      this.form.get('endTime')?.disable();
    } else {
      this.form.get('startTime')?.enable();
      this.form.get('endTime')?.enable();
    }
  }

  create() {
    if (this.creating) return;

    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Form non valido',
      };
      this.errorService.showError(error);
      return;
    }

    this.creating = true;

    let v = this.form.value;
    const absence: CreateAbsenceDto = {
      date: v.date,
      startTime: v.allDay ? '' : getTime(v.startTime),
      endTime: v.allDay ? '' : getTime(v.endTime),
      reason: v.reason,
      staffId: this.staffId,
    };

    this.absenceService.createAbsence(absence).subscribe((res: any) => {
      console.log(res);
      this.router.navigate([
        '/private/' +
          this.shopStore.slug +
          '/staff/' +
          this.staffStore.currentStaff.id +
          '/absences',
      ]);
    });
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
