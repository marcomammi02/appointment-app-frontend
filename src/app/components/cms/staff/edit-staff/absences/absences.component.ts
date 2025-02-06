import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../../../global/loading/loading.component';
import { ShopStore } from '../../../../../stores/shop.store';
import { capitalizeFirstLetter, formatDateToStringDayFirst } from '../../../../../services/utility.service';
import { StaffStore } from '../../../../../stores/staff.store';
import { PrimaryBtnComponent } from '../../../../global/primary-btn/primary-btn.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CancelBtnComponent } from '../../../../global/cancel-btn/cancel-btn.component';
import { StaffService } from '../../../../../services/staff.service';
import { AbsenceService } from '../../../../../services/absence.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-absences',
  standalone: true,
  imports: [
    RouterModule,
    LoadingComponent,
    PrimaryBtnComponent,
    ConfirmDialogModule,
    CancelBtnComponent,
    NgIf,
    TableModule,
  ],
  templateUrl: './absences.component.html',
  styleUrl: './absences.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class AbsencesComponent {
  constructor(
    public shopStore: ShopStore,
    public staffStore: StaffStore,
    private route: ActivatedRoute,
    private staffService: StaffService,
    private absenceService: AbsenceService
  ) {}

  loading: boolean = true;

  staffId!: number;

  absences: any[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('staffId');
      this.staffId = +id!;

      if (id) {
        this.getDetail(+id);
        this.getAbsences(+id);
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
  async getAbsences(id: number) {
    this.absenceService.getAbsencesByStaffId(id).subscribe((res) => {
      this.absences = res;
      console.log(this.absences);
    });
  }

  createAbsString(absence: any) {
    const day = formatDateToStringDayFirst(absence.date)

    if (absence.startTime && absence.endTime) {
      return `${day} | ${absence.startTime} - ${absence.endTime}`;
    }
    return `${day} | Tutto il giorno`;
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
