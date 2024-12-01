import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShopStore } from '../stores/shop.store';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { editShop } from '../dtos/shop.dto';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

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
        
        // Set currentShop in localStorage
        localStorage.setItem('currentShop', JSON.stringify(res));
      },
      (error) => {
        console.error('Failed to fetch shop:', error);
      }
    );
  }

  update(shop: editShop) {
    return this.http.patch(`${this.apiUrl}/${this.shopStore.shopId}`, shop).pipe(
      finalize(() => this.getShop()) // Refresh shop data after the update
    );
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
}
