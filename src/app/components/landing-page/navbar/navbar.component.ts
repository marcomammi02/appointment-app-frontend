import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HamburgerBtnComponent } from "../../global/hamburger-btn/hamburger-btn.component";
import { LandingStore } from '../../../stores/landing.store';
import { PrimaryBtnComponent } from "../../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    HamburgerBtnComponent, 
    PrimaryBtnComponent,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private scroller: ViewportScroller,
    private router: Router,
    public landingStore: LandingStore
  ) {
  }

  smallMenuOpen: boolean = false;

  smallMenuToggler(): void {
    this.smallMenuOpen = !this.smallMenuOpen;
  }

  goToSection(label: string) {
    switch (label) {
      case 'Chi Siamo':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor("_chi_siamo");
          }, 200);
        });
        break;
      case 'Contatti':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor("_contatti");
          }, 200);
        });
        break;
    }
  }
}
