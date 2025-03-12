import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShopStore } from '../stores/shop.store';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { editShop } from '../dtos/shop.dto';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private apiUrl: string = environment.apiUrl + '/shops';

  constructor(
    private http: HttpClient,
    private shopStore: ShopStore,
    private storage: Storage // Usa il modulo moderno
  ) {}

  async getShop() {
    return this.http.get(`${this.apiUrl}/${this.shopStore.shopId}`).subscribe(
      (res: any) => {
        this.shopStore.currentShop = res;
        this.shopStore.slug = res.slug

        console.log(res)

        // Set currentShop in localStorage
        localStorage.setItem('currentShop', JSON.stringify(res));
      },
      (error) => {
        console.error('Failed to fetch shop:', error);
      }
    );
  }

  async getShopPublic(): Promise<any> {
    try {
      return await new Promise<any>((resolve, reject) => {
        this.http.get(`${this.apiUrl}/slug/${this.shopStore.slug}`).subscribe(
          (res: any) => {
            this.shopStore.currentShop = res;
            this.shopStore.shopId = res.id;
            resolve(res)
          },
          (error) => reject(error)
        );
      });
    } catch (error) {
      console.error('Failed to fetch shop:', error);
      return null; // Importante per segnalare che lo shop non esiste
    }
  }

  update(shop: editShop, shopId?: number) {
    return this.http
      .patch(`${this.apiUrl}/${shopId ? shopId : this.shopStore.shopId}`, shop)
      .pipe(
        finalize(() => this.getShop()) // Refresh shop data after the update
      );
  }

  create(shop: any) {
    return this.http
      .post(`${this.apiUrl}`, shop)
      .pipe(
        finalize(() => this.getShop()) // get shop data after the creation
      );
  }

  createFreeTrial(shop: any) {
    return this.http.post(`${this.apiUrl}/free-trial`, shop)
  }

  uploadFile(file: File, path: string): Observable<string> {
    const fileRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Observable<string>((observer) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => observer.error(error),
        async () => {
          try {
            const url = await getDownloadURL(fileRef);
            observer.next(url);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    });
  }

  resetLocalStorage(): void {
    localStorage.clear();
    console.log('Local storage has been reset.');
  }
}
