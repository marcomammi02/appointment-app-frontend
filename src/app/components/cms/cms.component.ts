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
    if (!this.shopStore.shopId) {
      this.getShopId()
    }
    this.getShop()
  }

  getShopId() {
    const storedShopId = localStorage.getItem('shopId');
    if (storedShopId) {
      this.shopStore.shopId = Number(storedShopId);
    }
  }

  getShop() {
    // Retrieve shop from ShopStore or fallback to localStorage
    let shop = this.shopStore.currentShop;

    if (!shop.id) {
      // Attempt to retrieve shop from localStorage
      const storedShop = localStorage.getItem('currentShop');
      if (storedShop) {
        this.shopStore.currentShop = JSON.parse(storedShop)
      } else {
        this.shopService.getShop()
      }
    }
 }
}
