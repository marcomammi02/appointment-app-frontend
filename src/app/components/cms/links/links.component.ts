import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from "../../global/loading/loading.component";
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ShopStore } from '../../../stores/shop.store';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [
    LoadingComponent,
    RouterModule,
    NgIf,
    FloatLabelModule,
    InputTextModule,
    FormsModule
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

  loading: boolean = true

  ngOnInit() {
    this.getLink()
  }

  getLink() {
    this.link = this.link + this.shopStore.slug
    this.loading = false
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
}
