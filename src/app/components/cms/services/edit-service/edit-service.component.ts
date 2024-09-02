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
import {ServicesStore} from "../../../../stores/services.store";


@Component({
  selector: 'app-edit-service',
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
    NgClass
  ],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    private errorService: ErrorService,
    private servicesStore: ServicesStore
  ) {
  }

  form!: FormGroup

  durations = [
    {name: '15 min', minutes: 15},
    {name: '30 min', minutes: 30},
    {name: '45 min', minutes: 45},
    {name: '1 h', minutes: 60},
    {name: '1 h 15 min', minutes: 75},
    {name: '1 h 30 min', minutes: 90},
    {name: '1 h 45 min', minutes: 105},
    {name: '2 h', minutes: 120},
    {name: '2 h 15 min', minutes: 135},
    {name: '2 h 30 min', minutes: 150},
    {name: '2 h 45 min', minutes: 165},
    {name: '3 h', minutes: 180},
    {name: '3 h 15 min', minutes: 195},
    {name: '3 h 30 min', minutes: 210},
    {name: '3 h 45 min', minutes: 225},
    {name: '4 h', minutes: 240},
    {name: '4 h 15 min', minutes: 255},
    {name: '4 h 30 min', minutes: 270},
    {name: '4 h 45 min', minutes: 285},
    {name: '5 h', minutes: 300},
    {name: '5 h 15 min', minutes: 315},
    {name: '5 h 30 min', minutes: 330},
    {name: '5 h 45 min', minutes: 345},
    {name: '6 h', minutes: 360},
    {name: '6 h 15 min', minutes: 375},
    {name: '6 h 30 min', minutes: 390},
    {name: '6 h 45 min', minutes: 405},
    {name: '7 h', minutes: 420},
    {name: '7 h 15 min', minutes: 435},
    {name: '7 h 30 min', minutes: 450},
    {name: '7 h 45 min', minutes: 465},
    {name: '8 h', minutes: 480},
  ];

  display!: boolean

  @Output() updated: EventEmitter<any> = new EventEmitter<any>

  ngOnInit() {
    this.display = false
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: [this.servicesStore.currentService.name, Validators.required],
      description: [this.servicesStore.currentService.description, Validators.required],
      duration: [this.servicesStore.currentService.duration, Validators.required],
      price: [this.servicesStore.currentService.price, [Validators.required, Validators.min(0)]]
    })
  }

  openDialog() {
    this.display = true
    this.buildForm()
  }

  closeDialog() {
    this.display = false
  }

  create() {
    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      }
      this.errorService.showError(error)
    }

    let v = this.form.value
    const service: CreateServiceDto = {
      name: v.name,
      description: v.description,
      duration: v.duration.minutes,
      price: v.price,
      shopId: 3   // Example
    }

    this.servicesService.create(service).subscribe(
      res => {
        this.closeDialog()
        this.updated.emit()
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
