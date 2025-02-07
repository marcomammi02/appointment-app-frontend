import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingComponent } from '../../../../global/loading/loading.component';
import { ShopStore } from '../../../../../stores/shop.store';
import {
  capitalizeFirstLetter,
  formatDateToStringDayFirst,
} from '../../../../../services/utility.service';
import { DialogModule } from 'primeng/dialog';
import { StaffStore } from '../../../../../stores/staff.store';
import { PrimaryBtnComponent } from '../../../../global/primary-btn/primary-btn.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CancelBtnComponent } from '../../../../global/cancel-btn/cancel-btn.component';
import { StaffService } from '../../../../../services/staff.service';
import { AbsenceService } from '../../../../../services/absence.service';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    DialogModule
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
    private absenceService: AbsenceService,
    private confirmationService: ConfirmationService
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
    this.loading = true;
    this.absences = [];
    this.absenceService.getAbsencesByStaffId(id).subscribe((res) => {
      this.absences = res.sort((a: any, b: any) => b.id - a.id); // Ordina per ID decrescente
      console.log(this.absences);
      this.loading = false;
    });
  }

  createAbsString(absence: any) {
    const day = formatDateToStringDayFirst(absence.date);

    if (absence.startTime && absence.endTime) {
      return `${day} | ${absence.startTime} - ${absence.endTime}`;
    }
    return `${day} | Tutto il giorno`;
  }

  confirmDelete(absence: any) {
    this.confirmationService.confirm({
      target: absence.target as EventTarget,
      message: `Sei sicuro di voler eliminare l'assenza pianificata per il "${formatDateToStringDayFirst(
        absence.date
      )}"?`,
      header: 'Attenzione',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      rejectLabel: 'No',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.delete(+absence.id);
      },
    });
  }

  delete(id: number) {
    this.shopStore.transparentLoading = true;
    this.absenceService.deleteAbsence(id).subscribe(() => {
      this.absences = this.absences.filter((absence) => absence.id !== id);
      this.shopStore.transparentLoading = false;
    });
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
