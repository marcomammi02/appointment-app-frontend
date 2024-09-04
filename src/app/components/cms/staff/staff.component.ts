import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {RouterLink} from "@angular/router";
import {StaffStore} from "../../../stores/staff.store";
import {capitalizeFirstLetter} from "../../../services/utility.service";

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
export class StaffComponent {
    constructor(public staffStore: StaffStore) {
    }

  protected readonly capitalizeFirstLetter = capitalizeFirstLetter;
}
