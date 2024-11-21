import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { ShopStore } from '../../stores/shop.store';
import { LoadingComponent } from "../global/loading/loading.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    public shopStore: ShopStore
  ) {}

  loading: boolean = true

  ngOnInit(): void {
    this.extractShopIdFromUrl()
    this.shopService.getShop().then(()=> this.loading = false)
  }

  extractShopIdFromUrl(): void {
    // Estrapola il parametro `shopId` dall'URL e lo converte in numero
    const shopIdParam = this.route.snapshot.paramMap.get('shopId');
    this.shopStore.shopId = shopIdParam ? +shopIdParam : 0;
  }
}
