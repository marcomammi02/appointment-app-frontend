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
import {ShopStore} from "../../../../stores/shop.store";
import {ColorPickerModule} from "primeng/colorpicker";
import { LoadingComponent } from "../../../global/loading/loading.component";


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
    NgClass,
    RouterLink,
    NgIf,
    DeleteBtnComponent,
    ToastModule,
    ConfirmDialogModule,
    ColorPickerModule,
    LoadingComponent
],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class EditServiceComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    public servicesStore: ServicesStore,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    public shopStore: ShopStore
  ) {
  }

  form!: FormGroup

  currentService?: any

  loading: boolean = true

  serviceId!: number

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('serviceId');
      this.serviceId = +id!
      if (id) {
        this.getDetail(+id)
      }
    });
  }

  async getDetail(id: number) {
     this.servicesService.getDetail(id).subscribe({
      next: (res) => {
      this.currentService = res;
      this.buildForm()
      this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: [capitalizeFirstLetter(this.currentService.name), Validators.required],
      description: [capitalizeFirstLetter(this.currentService.description), Validators.required],
      duration: [this.findDuration(this.currentService.duration), Validators.required],
      price: [this.currentService.price, [Validators.required, Validators.min(0)]],
      color: [this.currentService.color]
    })
  }

  findDuration(duration: number) {
    return this.servicesStore.durations.find(d => d.minutes == duration)
  }

  update() {
    if (this.form.invalid) {
      let error: MyError = {
        label: 'Attenzione',
        message: 'Inserire tutti i campi'
      }
      this.errorService.showError(error)
      return
    }

    let v = this.form.value
    const service: UpdateServiceDto = {
      name: v.name,
      description: v.description,
      duration: v.duration.minutes,
      price: v.price,
      color: v.color
    }

    this.servicesService.update(this.currentService.id, service).subscribe(
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

  delete() {
    if (this.serviceId != null) {
      this.servicesService.delete(+this.serviceId).subscribe(
        res => {
          this.router.navigate([`/private/${this.shopStore.shopId}/services`])
        },
        err => console.error(err.message)
      )
    }
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Sei sicuro di voler eliminare "${this.currentService.name}"?`,
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
