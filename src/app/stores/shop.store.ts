import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ShopStore {
  shopId!: number
  slug!: string
  workingHours: any = []
  currentShop: any = {}

  transparentLoading: boolean = false
}
