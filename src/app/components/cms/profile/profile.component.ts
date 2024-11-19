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
    FileUploadModule
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    public shopStore: ShopStore,
    private shopService: ShopService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  loading: boolean = false

  form!: FormGroup

  selectedLogo: File | null = null
  selectedCover: File | null = null

  downloadURL: string | null = null;

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

  onFileSelected(event: any, imgType: string) {
    if (imgType == 'logo') {
      this.selectedLogo = event.files[0]
    } else if (imgType == 'cover') {
      this.selectedCover = event.files[0]
    }
  }

  uploadFile(): void {
    if (this.selectedLogo) {
      const path = `uploads/${this.selectedLogo.name}`;
      this.shopService.uploadFile(this.selectedLogo, path).subscribe(
        (url: string) => {
          this.downloadURL = url;
          console.log('File uploaded successfully:', url);
        },
        (error: any) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  edit() {
    if (this.editing) return

    this.editing = true

    let v = this.form.value
    console.log(v)
    const shop: editShop = {
      name: v.name,
      description: v.description,
      address: v.address,
      phoneNumber: v.phone,
      email: v.email,
      logo: v.logo,
      cover: v.cover
    }

    this.shopService.update(shop).subscribe(
      res => {
        this.uploadFile()
        this.editing = false
      },
      err => {
        let error: MyError = {
          label: 'Errore',
          message: err.message
        }
        this.errorService.showError(error)
        this.editing = false
      }
    )
  }

}
