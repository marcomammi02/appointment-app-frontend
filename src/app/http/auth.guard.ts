import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {ShopStore} from "../stores/shop.store";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private shopStore: ShopStore
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Controlla se l'utente è autenticato
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const routeShopId = +route.params['shopId'];
    const storeShopId = +localStorage.getItem('shopId')


    // Controlla se gli ID corrispondono
    if (routeShopId !== storeShopId) {
      this.authService.logout(); // Effettua il logout
      localStorage.removeItem('shopId')
      this.router.navigate(['/login']); // Reindirizza alla pagina di login
      return false;
    }

    return true;
  }
}
