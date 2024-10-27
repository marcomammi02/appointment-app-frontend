import {Component} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ShopStore} from "../../../stores/shop.store";
import {AuthService} from "../../../services/auth.service";
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  constructor(
    private router: Router,
    public shopStore: ShopStore,
    private authService: AuthService
  ) {
  }
  displaySidebar: boolean = false

  navigate(label: string) {
    this.router.navigate([`private/${this.shopStore.shopId}/${label}`])
    this.displaySidebar = false
  }

  logout() {
    this.authService.logout()
    this.router.navigate([`login`])
  }
}
