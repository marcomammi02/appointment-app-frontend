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
import {CreateServiceDto} from "../../../../dtos/services.dto";
import {ServicesService} from "../../../../services/services.service";
import {ErrorService, MyError} from "../../../../services/error.service";
import {Router, RouterLink} from "@angular/router";
import {ServicesStore} from "../../../../stores/services.store";
import {ShopStore} from "../../../../stores/shop.store";
import {ColorPickerModule} from "primeng/colorpicker";
import { MultiSelectModule } from 'primeng/multiselect';
import { StaffService } from '../../../../services/staff.service';


@Component({
  selector: 'app-create-service',
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
    RouterLink,
    ColorPickerModule,
    MultiSelectModule,
    NgIf
  ],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    private errorService: ErrorService,
    public servicesStore: ServicesStore,
    private router: Router,
    public shopStore: ShopStore,
    private staffService: StaffService
  ) {
  }

  form!: FormGroup

  creating: boolean = false

  staff: any = []

  ngOnInit() {
    this.getStaff()
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      color: ['#feb64a'],
      staff: [[], Validators.required]
    })
  }

  get staffInvalid() {
    return this.form.get('staff')?.invalid && this.form.get('staff')?.touched;
  }

  getStaff() {
    this.staffService.getStaff().subscribe((res: any) => {
      this.staff = res
    })
  }

  create() {
    if (this.creating) return

    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      }
      this.errorService.showError(error)
      return
    }
    
    this.creating = true

    let v = this.form.value
    const service: CreateServiceDto = {
      name: v.name,
      description: v.description,
      duration: v.duration.minutes,
      price: v.price,
      shopId: this.shopStore.shopId,
      color: v.color,
      staffIds: v.staff.map((s: any) => s.id)
    }

    this.servicesService.create(service).subscribe(
      res => {
        this.router.navigate([`/private/${this.shopStore.slug}/services`])
      },
      err => {
        let error: MyError = {
          label: 'Errore',
          message: err.message
        }
        this.errorService.showError(error)
        this.creating = false
      }
    )
  }
}
