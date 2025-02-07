import { Component } from '@angular/core';
import { LoadingComponent } from '../../../../../global/loading/loading.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StaffStore } from '../../../../../../stores/staff.store';
import { ShopStore } from '../../../../../../stores/shop.store';
import { capitalizeFirstLetter } from '../../../../../../services/utility.service';
import { NgIf } from '@angular/common';
import { StaffService } from '../../../../../../services/staff.service';
import { CancelBtnComponent } from '../../../../../global/cancel-btn/cancel-btn.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-abs',
  standalone: true,
  imports: [
    LoadingComponent,
    RouterModule,
    NgIf,
    CancelBtnComponent,
    ReactiveFormsModule
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
    private formBuilder: FormBuilder
  ) {}

  loading: boolean = true;

  staffId!: number;

  form!: FormGroup

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('staffId');
      this.staffId = +id!;

      if (id) {
        this.getDetail(+id);
        this.buildForm()
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
      date: [''],
      startTime: [''],
      endTime: [''],
      reason: ['']
    });
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
