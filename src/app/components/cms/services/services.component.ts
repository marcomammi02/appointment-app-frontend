import { Component } from '@angular/core';
import {PrimaryBtnComponent} from "../../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    PrimaryBtnComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

}
