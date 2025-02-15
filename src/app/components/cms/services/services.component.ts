import {Component, OnInit} from '@angular/core';
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {ServicesService} from "../../../services/services.service";
import {CommonModule} from "@angular/common";
import {ServicesStore} from "../../../stores/services.store";
import {CreateServiceComponent} from "./create-service/create-service.component";
import {EditServiceComponent} from "./edit-service/edit-service.component";
import {RouterLink} from "@angular/router";
import {ShopStore} from "../../../stores/shop.store";
import { LoadingComponent } from "../../global/loading/loading.component";
import {capitalizeFirstLetter} from "../../../services/utility.service";


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    PrimaryBtnComponent,
    CommonModule, 
    RouterLink,
    LoadingComponent
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

  loading: boolean = true

  ngOnInit() {
    this.getServices()
  }

  getServices() {
    this.servicesService.getServices().subscribe({
      next: (res: any) => {
        this.servicesStore.services = res.sort((a: any, b: any) => a.id - b.id); // Ordinamento crescente per ID
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
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
