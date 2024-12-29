import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ShopStore } from '../../../stores/shop.store';
import { QRCodeModule } from 'angularx-qrcode';
import { SafeUrl } from '@angular/platform-browser';
import { PrimaryBtnComponent } from "../../global/primary-btn/primary-btn.component";

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    LoadingComponent,
    RouterModule,
    NgIf,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    QRCodeModule,
    PrimaryBtnComponent
],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {

  constructor(
    public shopStore: ShopStore
  ) {}

  // Link provvisorio .it
  link: string = 'https://bookami.it/'
  public qrCodeDownloadLink: SafeUrl = "";
  loading: boolean = true

  ngOnInit() {
    this.getLink()
  }

  getLink() {
    this.link = this.link + this.shopStore.slug
    this.loading = false
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  copyLink() {
    if (this.link) {
      navigator.clipboard.writeText(this.link).then(() => {
        alert('Link copiato negli appunti!');
      }).catch(err => {
        console.error('Errore durante la copia:', err);
      });
    } else {
      alert('Nessun link da copiare!');
    }
  }

  downloadQrCode() {
    const qrcodeCanvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (qrcodeCanvas) {
      const link = document.createElement('a');
      link.href = qrcodeCanvas.toDataURL('image/png');
      link.download = 'qrcode.png';
      link.click();
    } else {
      console.error('QR Code canvas non trovato.');
    }
  }
}
