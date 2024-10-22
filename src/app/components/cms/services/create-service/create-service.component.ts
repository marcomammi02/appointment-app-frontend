import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {DropdownModule} from "primeng/dropdown";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {NgClass} from "@angular/common";
import {CreateServiceDto} from "../../../../dtos/services.dto";
import {ServicesService} from "../../../../services/services.service";
import {ErrorService, MyError} from "../../../../services/error.service";
import {Router, RouterLink} from "@angular/router";
import {ServicesStore} from "../../../../stores/services.store";
import {ShopStore} from "../../../../stores/shop.store";
import {ColorPickerModule} from "primeng/colorpicker";


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
    NgClass,
    RouterLink,
    ColorPickerModule
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
    public shopStore: ShopStore
  ) {
  }

  form!: FormGroup

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      color: ['#feb64a']
    })
  }

  create() {
    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      }
      this.errorService.showError(error)
      return
    }

    let v = this.form.value
    const service: CreateServiceDto = {
      name: v.name,
      description: v.description,
      duration: v.duration.minutes,
      price: v.price,
      shopId: 3,   // Example
      color: v.color
    }

    this.servicesService.create(service).subscribe(
      res => {
        this.router.navigate([`/private/${this.shopStore.shopId}/services`])
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
