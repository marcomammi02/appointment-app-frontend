import {Component} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ShopStore} from "../../../stores/shop.store";
import {AuthService} from "../../../services/auth.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { ShopService } from '../../../services/shop.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgStyle,
    ConfirmDialogModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService]
})
export class SidebarComponent  {
  constructor(
    private router: Router,
    public shopStore: ShopStore,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private shopService: ShopService
  ) {
  }
  displaySidebar: boolean = false

  navigate(label: string) {
    this.router.navigate([`private/${this.shopStore.slug}/${label}`])
    this.displaySidebar = false
  } 

  logout() {
    this.confirmationService.confirm({
      target: event!.target as EventTarget,
      message: `Confermi di voler uscire?`,
      header: 'Attenzione',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      acceptLabel: 'Si',
      rejectButtonStyleClass:"p-button-text p-button-text",
      rejectLabel: 'No',
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.authService.logout()
        this.shopStore.currentShop = {}
        this.shopService.resetLocalStorage()
        this.router.navigate([`login`])
      }
    });
  }
}
