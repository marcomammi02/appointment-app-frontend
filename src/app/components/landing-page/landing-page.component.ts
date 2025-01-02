import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { HeroComponent } from './hero/hero.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
