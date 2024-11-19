import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ShopStore} from "../stores/shop.store";
import {Observable, tap} from "rxjs";
import {environment} from "../../environments/environment";
import { editShop } from "../dtos/shop.dto";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ShopService{

  constructor(
    private http: HttpClient, 
    private shopStore: ShopStore,
    private storage: AngularFireStorage
  ) {}

  private apiUrl: string = environment.apiUrl + '/shops'

  async getShop() {
    return this.http.get(`${this.apiUrl}/${this.shopStore.shopId}`).subscribe(
      (res: any) => {
        this.shopStore.currentShop = res;

        localStorage.setItem('currentShop', JSON.stringify(res));
      },
      (error) => {
        console.error("Failed to fetch shop:", error);
      }
    );
  }

  update(shop: editShop) {
    return this.http.patch(`${this.apiUrl}/${this.shopStore.shopId}`, shop).pipe(
      tap(() => this.getShop()) // Automatically refresh shop data after the update
    );
  }

  uploadImage(file: File, imgType: string) {
  }

  uploadFile(file: File, path: string): Observable<string> {
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    return new Observable<string>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);
            observer.complete();
          });
        })
      ).subscribe();
    });
  }
}
