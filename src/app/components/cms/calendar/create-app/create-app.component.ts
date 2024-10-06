import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {CancelBtnComponent} from "../../../global/cancel-btn/cancel-btn.component";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {PrimaryBtnComponent} from "../../../global/primary-btn/primary-btn.component";
import {PrimeTemplate} from "primeng/api";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ShopStore} from "../../../../stores/shop.store";
import {RouterLink} from "@angular/router";
import {ServicesService} from "../../../../services/services.service";
import {ServicesStore} from "../../../../stores/services.store";
import {StaffService} from "../../../../services/staff.service";
import {StaffStore} from "../../../../stores/staff.store";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-create-app',
  standalone: true,
  imports: [
    ButtonDirective,
    CalendarModule,
    CancelBtnComponent,
    FloatLabelModule,
    InputTextModule,
    NgForOf,
    PaginatorModule,
    PrimaryBtnComponent,
    PrimeTemplate,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss'
})
export class CreateAppComponent implements OnInit{
  constructor(
    public shopStore: ShopStore,
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    public servicesStore: ServicesStore,
    private staffService: StaffService,
    public staffStore: StaffStore
  ) {
  }

  form!: FormGroup

  ngOnInit() {
    this.buildForm()
    this.getServices()
    this.getStaff()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      serviceId: [null, Validators.required],
      staffId: [null],
      startTime: ['', Validators.required]
    })
  }

  getServices() {
    this.servicesService.getServices().subscribe(res => {
      this.servicesStore.services = res
    })
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.staffStore.staffList = res
    })
  }
}
