import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ShopStore} from "../stores/shop.store";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShopService{

  constructor(private http: HttpClient, private shopStore: ShopStore) {}

  private apiUrl: string = 'http://localhost:3000/shops'
  async getShop() {
    return this.http.get(`${this.apiUrl}/${this.shopStore.shopId}`).subscribe(res => {
      this.shopStore.currentShop = res
    })
  }
}
