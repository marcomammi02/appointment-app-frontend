import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {RouterLink} from "@angular/router";
import {StaffStore} from "../../../stores/staff.store";
import {capitalizeFirstLetter} from "../../../services/utility.service";
import {StaffService} from "../../../services/staff.service";
import {ShopStore} from "../../../stores/shop.store";
import { LoadingComponent } from '../../global/loading/loading.component';

@Component({
  selector: 'app-staff',
  standalone: true,
    imports: [
    NgForOf,
    NgIf,
    PrimaryBtnComponent,
    RouterLink,
    LoadingComponent
],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit{
    constructor(
      public staffStore: StaffStore,
      private staffService: StaffService,
      public shopStore: ShopStore
    ) {}

    loading: boolean = true

  ngOnInit() {
    this.getStaff()
  }

  getStaff() {
    this.staffService.getStaff().subscribe({
      next: (res: any) => {
      this.staffStore.staffList = res.sort((a: any, b: any) => a.id - b.id)
      this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.loading = false
      }
    })
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
