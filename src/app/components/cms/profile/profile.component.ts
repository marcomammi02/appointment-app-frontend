import { Component, OnInit } from '@angular/core';
import { LoginPageComponent } from '../../login-page/login-page.component';
import { LoadingComponent } from "../../global/loading/loading.component";
import { NgIf } from '@angular/common';
import { PrimaryBtnComponent } from '../../global/primary-btn/primary-btn.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ShopStore } from '../../../stores/shop.store';
import { capitalizeFirstLetter } from '../../../services/utility.service';
import { CancelBtnComponent } from "../../global/cancel-btn/cancel-btn.component";
import { Router, RouterLink } from '@angular/router';
import { editShop } from '../../../dtos/shop.dto';
import { ShopService } from '../../../services/shop.service';
import { ErrorService, MyError } from '../../../services/error.service';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    LoadingComponent,
    NgIf,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextareaModule,
    InputNumberModule,
    InputTextModule,
    PrimaryBtnComponent,
    CancelBtnComponent,
    RouterLink,
    FileUploadModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public shopStore: ShopStore,
    private shopService: ShopService,
    private router: Router,
    private errorService: ErrorService,
    private messageService: MessageService
  ) {}

  loading: boolean = false

  form!: FormGroup

  selectedLogo: File | null = null
  selectedCover: File | null = null

  downloadLogoURL?: string
  downloadCoverURL?: string


  editing: boolean = false

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    // Retrieve shop from ShopStore or fallback to localStorage
    let shop = this.shopStore.currentShop;

    if (!shop.id) {
      // Attempt to retrieve shop from localStorage
      const storedShop = localStorage.getItem('currentShop');
      shop = storedShop ? JSON.parse(storedShop) : null;
    }

    // Ensure shop is initialized to prevent errors
    if (!shop) {
      console.error('Shop data is not available.');
      return;
    }

    // Build form with shop data
    this.form = this.formBuilder.group({
      name: [capitalizeFirstLetter(shop.name)],
      description: [capitalizeFirstLetter(shop.description)],
      phone: [shop.phoneNumber],
      email: [shop.email],
      address: [capitalizeFirstLetter(shop.address)],
    });
  }

  uploadFile(): Promise<void> {
    const uploads: Promise<void>[] = [];
  
    if (this.selectedLogo) {
      const path = `logos/${this.shopStore.shopId}`;
      const logoUpload = new Promise<void>((resolve, reject) => {
        this.shopService.uploadFile(this.selectedLogo!, path).subscribe(
          (url: string) => {
            this.downloadLogoURL = url;
            console.log('Logo uploaded successfully:', url);
            resolve();
          },
          (error: any) => {
            console.error('Error uploading logo:', error);
            reject(error);
          }
        );
      });
      uploads.push(logoUpload);
    }
  
    if (this.selectedCover) {
      const path = `covers/${this.shopStore.shopId}`;
      const coverUpload = new Promise<void>((resolve, reject) => {
        this.shopService.uploadFile(this.selectedCover!, path).subscribe(
          (url: string) => {
            this.downloadCoverURL = url;
            console.log('Cover uploaded successfully:', url);
            resolve();
          },
          (error: any) => {
            console.error('Error uploading cover:', error);
            reject(error);
          }
        );
      });
      uploads.push(coverUpload);
    }
  
    // Restituisci una Promise che si risolve quando tutti i caricamenti sono completati
    return Promise.all(uploads).then(() => {
    });
  }

  triggerFileInput(type: 'logo' | 'cover') {
    if (type === 'logo') {
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      fileInput.click();
    } else if (type === 'cover') {
      const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
      fileInput.click();
    }
  }
  
  onFileSelected(event: Event, type: 'logo' | 'cover') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          this.shopStore.currentShop.logo = reader.result as string; // Anteprima immediata
        } else if (type === 'cover') {
          this.shopStore.currentShop.cover = reader.result as string; // Anteprima immediata
        }
      };
      reader.readAsDataURL(file); // Legge il file per mostrarlo come anteprima
    }
  }

  async edit() {
    if (this.editing) return;
  
    this.editing = true;
  
    try {
      // Aspetta il completamento degli upload
      await this.uploadFile();
  
      let v = this.form.value;
      console.log(v);
      const shop: editShop = {
        name: v.name,
        description: v.description,
        address: v.address,
        phoneNumber: v.phone,
        email: v.email,
        logo: this.downloadLogoURL,
        cover: this.downloadCoverURL,
      };
      console.log(this.downloadLogoURL);
  
      // Effettua l'update
      this.shopService.update(shop).subscribe(
        res => {
          this.messageService.add({ severity: 'success', summary: '', detail: 'Modifiche salvate' });
          
          // Aggiorna lo store
          this.shopStore.currentShop = {
            ...this.shopStore.currentShop, // Mantieni le altre proprietà esistenti
            ...shop, // Aggiorna le proprietà modificate
          };

          // Salva lo store aggiornato nel localStorage
          localStorage.setItem('currentShop', JSON.stringify(this.shopStore.currentShop));

          this.editing = false;
  
          // Ricarica la pagina
          window.location.reload();
        },
        err => {
          let error: MyError = {
            label: 'Errore',
            message: err.message,
          };
          this.errorService.showError(error);
          this.editing = false;
        }
      );
    } catch (error) {
      console.error('Error during upload:', error);
      let myError: MyError = {
        label: 'Errore',
        message: 'Errore durante il caricamento dei file',
      };
      this.errorService.showError(myError);
      this.editing = false;
    }
  }
  

}
