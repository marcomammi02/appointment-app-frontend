import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {ShopService} from "../../services/shop.service";
import {ShopStore} from "../../stores/shop.store";

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
  ) {}

  ngOnInit() {
    this.initializeShop();
  }

  // Metodo principale per inizializzare lo stato dello shop
  private initializeShop() {
    const storedShopId = this.loadShopIdFromStorage();
    const storedShop = this.loadShopFromStorage();

    // Se abbiamo uno shopId o uno shop valido in memoria, li sincronizziamo
    if (storedShopId) {
      this.shopStore.shopId = storedShopId;
    }

    if (storedShop && storedShop.id) {
      this.shopStore.currentShop = storedShop;
    }

    // Se manca lo shop, recuperiamo i dati dal backend
    if (!this.shopStore.currentShop.id || !this.shopStore.shopId) {
      this.fetchShopFromService();
    }
  }

  // Recupera lo shopId da localStorage
  private loadShopIdFromStorage(): number | null {
    const storedShopId = localStorage.getItem('shopId');
    return storedShopId ? Number(storedShopId) : null;
  }

  // Recupera lo shop da localStorage
  private loadShopFromStorage(): any | null {
    const storedShop = localStorage.getItem('currentShop');
    return storedShop ? JSON.parse(storedShop) : null;
  }

  // Recupera i dati dello shop dal servizio
  private fetchShopFromService() {
    this.shopService.getShop()
  };
}
