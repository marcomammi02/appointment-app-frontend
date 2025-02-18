import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimaryBtnComponent } from '../global/primary-btn/primary-btn.component';
import { ValidationService } from '../../services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Observable } from 'rxjs';
import { ErrorService } from '../../services/error.service';
import { ShopService } from '../../services/shop.service';
import { ShopStore } from '../../stores/shop.store';

@Component({
  selector: 'app-confirm-payment-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent,
  ],
  templateUrl: './confirm-payment-page.component.html',
  styleUrl: './confirm-payment-page.component.scss',
})
export class ConfirmPaymentPageComponent {
  ValidationService: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private errorService: ErrorService,
    private shopService: ShopService,
    private shopStore: ShopStore

  ) {}

  form!: FormGroup;

  paymentData: any;

  updating: boolean = false;

  ngOnInit() {
    this.buildForm();

    // Ottieni il session_id dal parametro dell'URL
    this.route.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];

      if (!sessionId) {
        this.router.navigate(['/']);
      }

      // Chiamata per verificare il pagamento
      this.verifyPayment(sessionId);
    });
    
  }
  
  async verifyPayment(sessionId: string) {
    this.paymentService.verifyPayment(sessionId).subscribe(
      (res: any) => {
        // Gestisci la risposta, ad esempio crea un account o mostra un errore
        this.paymentData = res;
        console.log('Pagamento verificato con successo', res);
        this.form.patchValue({
          email: res.email || '',
        });
      },
      (err: any) => {
        // Gestisci l'errore, ad esempio mostra un messaggio di errore
        console.error('Errore nella verifica del pagamento', err);
        this.router.navigate(['/']);
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: [this.paymentData? this.paymentData.email : '', [Validators.required, ValidationService.emailValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: ValidationService.checkPasswords }
    );
  }

  async generateSlug(name: string): Promise<string> {
    let slug = this.createSlugFromName(name); // Crea lo slug di base dal nome
    let isSlugAvailable = await this.isSlugAvailable(slug); // Verifica se lo slug è disponibile
  
    if (!isSlugAvailable) {
      // Aggiungi numeri finché non trovi uno slug disponibile
      let counter = 1;
      while (!isSlugAvailable) {
        slug = `${slug}-${counter}`;
        isSlugAvailable = await this.isSlugAvailable(slug);
        counter++;
      }
    }
  
    return slug; // Ritorna lo slug unico
  }
  
  // Funzione per creare lo slug a partire dal nome
  createSlugFromName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); // Forma lo slug
  }
  
  // Funzione per verificare se lo slug è disponibile
  async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const response: any = await this.shopService.getShopPublic(); // Usa il servizio per verificare lo slug
      return !response || !response.id; // Se non esiste, è disponibile
    } catch (error) {
      return true; // Se c'è un errore, considera lo slug disponibile
    }
  }
  
  

  update() {
    if (this.updating) return;
  
    let v = this.form.value;
  
    // Controllo se ci sono campi vuoti
    if (!v.name || !v.email || !v.password || !v.confirmPassword) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi',
      });
      return;
    }
  
    // Controllo se le password coincidono
    if (v.password !== v.confirmPassword) {
      this.errorService.showError({
        label: 'Errore Password',
        message: 'Le password non coincidono',
      });
      return;
    }
  
    this.updating = true;
  
    const shop = {
      name: v.name,
      email: v.email,
      password: v.password,
      slug: this.generateSlug(v.name),
    }

    console.log(shop)

    this.shopStore.shopId = this.paymentData.shopId;
    this.shopService.update(shop).subscribe()
  
    setTimeout(() => {
      this.updating = false;
      console.log('Aggiornamento completato!');
    }, 2000);
  }
  
}
