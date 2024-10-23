import {Component, OnInit, ViewChild} from '@angular/core';
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {ServicesService} from "../../../services/services.service";
import {CommonModule} from "@angular/common";
import {ServicesStore} from "../../../stores/services.store";
import {CreateServiceComponent} from "./create-service/create-service.component";
import {EditServiceComponent} from "./edit-service/edit-service.component";
import {ThLargeIcon} from "primeng/icons/thlarge";
import {Router, RouterLink} from "@angular/router";
import {capitalizeFirstLetter} from "../../../services/utility.service";
import {ShopStore} from "../../../stores/shop.store";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    PrimaryBtnComponent, CommonModule, CreateServiceComponent, EditServiceComponent, RouterLink
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  constructor(
    private servicesService: ServicesService,
    public servicesStore: ServicesStore,
    public shopStore: ShopStore
  ) {}

  ngOnInit() {
    this.getServices()
  }

  getServices() {
    this.servicesService.getServices().subscribe(res => {
      this.servicesStore.services = res
    })
  }

  getHourTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours == 0 && min > 0) return `${minutes} min`
    if (hours > 0 && min == 0) return `${hours} h`
    return `${hours} h ${min} min`;
  }

  getServiceColor(service: any) {
    return service.color
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
