import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ShopStore {
  shopId: number = 3
  workingHours: any = []
}
