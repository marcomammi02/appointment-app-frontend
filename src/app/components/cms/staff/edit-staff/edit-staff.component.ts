import {Component, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {NgClass, NgIf} from "@angular/common";
import {UpdateServiceDto} from "../../../../dtos/services.dto";
import {ServicesService} from "../../../../services/services.service";
import {ErrorService, MyError} from "../../../../services/error.service";
import {ServicesStore} from "../../../../stores/services.store";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {capitalizeFirstLetter} from "../../../../services/utility.service";
import {DeleteBtnComponent} from "../../../global/delete-btn/delete-btn.component";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {StaffService} from "../../../../services/staff.service";
import {StaffStore} from "../../../../stores/staff.store";
import {UpdateStaffDto} from "../../../../dtos/staff.dto";


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
  ],
  templateUrl: './edit-staff.component.html',
  styleUrl: './edit-staff.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class EditStaffComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private staffService: StaffService,
    public staffStore: StaffStore,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
  }

  form!: FormGroup

  currentStaff?: any

  staffId!: number

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('staffId');
      this.staffId = +id!
      if (id) {
        this.getDetail(+id)
      }
    });
  }

  getDetail(id: number) {
    this.staffService.getDetail(id).subscribe(res => {
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
