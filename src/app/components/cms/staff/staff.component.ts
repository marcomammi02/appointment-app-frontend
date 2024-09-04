import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {RouterLink} from "@angular/router";
import {StaffStore} from "../../../stores/staff.store";
import {capitalizeFirstLetter} from "../../../services/utility.service";
import {StaffService} from "../../../services/staff.service";

@Component({
  selector: 'app-staff',
  standalone: true,
    imports: [
        NgForOf,
        NgIf,
        PrimaryBtnComponent,
        RouterLink
    ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit{
    constructor(public staffStore: StaffStore, private staffService: StaffService) {}

  ngOnInit() {
    this.getStaff()
  }

  getStaff() {
    this.staffService.getStaff().subscribe(res => {
      this.staffStore.staffList = res
    })
  }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
  protected readonly caches = caches;
}
