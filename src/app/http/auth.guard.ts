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

    const routeSlug = route.params['slug'];
    const storeSlug = localStorage.getItem('slug')


    // Controlla se gli ID corrispondono
    if (routeSlug !== storeSlug) {
      this.authService.logout(); // Effettua il logout
      localStorage.removeItem('shopId')
      localStorage.removeItem('slug')
      this.router.navigate(['/login']); // Reindirizza alla pagina di login
      return false;
    }

    return true;
  }
}
