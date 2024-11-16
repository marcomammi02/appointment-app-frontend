import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ShopStore {
  shopId!: number
  workingHours: any = []
  currentShop: any = {}
}
