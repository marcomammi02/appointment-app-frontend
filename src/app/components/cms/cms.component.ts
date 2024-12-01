import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
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
export class CmsComponent implements OnInit{

  constructor(
    private shopService: ShopService,
    private shopStore: ShopStore,
  ) {
  }

  ngOnInit() {
    const storedShopId = localStorage.getItem('shopId');
    if (storedShopId) {
      this.shopStore.shopId = Number(storedShopId);
    }

    this.getShop()
  }

  getShop() {
    // Retrieve shop from ShopStore or fallback to localStorage
    let shop = this.shopStore.currentShop;

    if (!shop.id) {
      // Attempt to retrieve shop from localStorage
      const storedShop = localStorage.getItem('currentShop');
      this.shopStore.currentShop = storedShop ? JSON.parse(storedShop) : null;
    }
 }

}
