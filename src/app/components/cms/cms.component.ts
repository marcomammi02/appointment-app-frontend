import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet, Router} from "@angular/router";
import {ShopService} from "../../services/shop.service";
import {ShopStore} from "../../stores/shop.store";
import {SubscriptionService} from "../../services/subscription.service";

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.scss'
})
export class CmsComponent implements OnInit {

  constructor(
    private shopService: ShopService,
    private shopStore: ShopStore,
    private router: Router,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit() {
    this.initializeShop();
  }

  // Metodo principale per inizializzare lo stato dello shop
  private initializeShop() {
    const storedShopId = this.loadShopIdFromStorage();
    const storedSlug = this.loadSlugFromStorage();

    // Se abbiamo uno shopId o uno shop valido in memoria, li sincronizziamo
    if (storedShopId) {
      this.shopStore.shopId = storedShopId;
    }

    // Se abbiamo uno slug in memoria lo sincronizziamo
    if (storedSlug) {
      this.shopStore.slug = storedSlug;
    }

    // Se manca lo shop, recuperiamo i dati dal backend
    if (!this.shopStore.currentShop.id || !this.shopStore.shopId) {
      this.fetchShopFromService();
    } else {
      this.checkTrialStatus();
    }
  }

  // Recupera lo shopId da localStorage
  private loadShopIdFromStorage(): number | null {
    const storedShopId = localStorage.getItem('shopId');
    return storedShopId ? Number(storedShopId) : null;
  }

  // Recupera lo slog da localStorage
  private loadSlugFromStorage(): string | null {
    const storedSlug = localStorage.getItem('slug');
    return storedSlug ? storedSlug : null
  }

  // Recupera i dati dello shop dal servizio
  private async fetchShopFromService() {
    try {
      await this.shopService.getShop();
      this.checkTrialStatus();
    } catch (error) {
      console.error('Errore nel recupero dello shop:', error);
    }
  }

  private checkTrialStatus() {
    this.subscriptionService.getShopSubscription().subscribe({
      next: (subscription) => {
        if (!subscription?.trialExpirationDate) return;
        console.log(subscription)

        const trialExpiration = new Date(subscription.trialExpirationDate);
        const now = new Date();

        if (trialExpiration < now && !subscription.isActive) {
          this.router.navigate(['/dashboard-blocked']);
        }
      },
      error: (error) => {
        console.error('Errore nel recupero della subscription:', error);
      }
    });
  }
}
