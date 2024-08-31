import {Component, OnInit} from '@angular/core';
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";
import {ServicesService} from "../../../services/services.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    PrimaryBtnComponent, CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  constructor(private servicesService: ServicesService) {}

  ngOnInit() {
    this.servicesService.getServices()
  }
}
