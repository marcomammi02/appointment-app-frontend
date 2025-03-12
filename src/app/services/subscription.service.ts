import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShopStore } from '../stores/shop.store';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl: string = environment.apiUrl + '/subscriptions';

  constructor(
    private http: HttpClient,
    private shopStore: ShopStore
  ) {}

  getShopSubscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/shop/${this.shopStore.shopId}`);
  }
} 