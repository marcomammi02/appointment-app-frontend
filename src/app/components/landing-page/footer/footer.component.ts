import { Component } from '@angular/core';
import { LandingStore } from '../../../stores/landing.store';
import { ViewportScroller } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(
    private scroller: ViewportScroller,
    private router: Router,
    public landingStore: LandingStore
  ) {}

  goToSection(label: string) {
    switch (label) {
      case 'Prezzi':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor('pricing');
          }, 200);
        });
        break;
      case 'Features':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor('features');
          }, 200);
        });
        break;
      case 'FAQ':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor('faqs');
          }, 200);
        });
        break;
      case 'Recensioni':
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.scroller.scrollToAnchor('reviews');
          }, 200);
        });
        break;
    }
  }
}
