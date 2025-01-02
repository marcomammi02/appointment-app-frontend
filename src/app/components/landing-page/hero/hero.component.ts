import { Component } from '@angular/core';
import { PrimaryBtnComponent } from "../../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [PrimaryBtnComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

}
