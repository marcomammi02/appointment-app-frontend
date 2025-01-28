import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { HeroComponent } from './hero/hero.component';
import { AnnouncementBarComponent } from './announcement-bar/announcement-bar.component';
import { ComparisionComponent } from './comparision/comparision.component';
import { FaqsComponent } from "./faqs/faqs.component";
import { PricingComponent } from "./pricing/pricing.component";
import { FeaturesComponent } from "./features/features.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AnnouncementBarComponent,
    ComparisionComponent,
    FaqsComponent,
    PricingComponent,
    FeaturesComponent,
    ReviewsComponent,
    FooterComponent
],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
