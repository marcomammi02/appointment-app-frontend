import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PrimaryBtnComponent } from '../global/primary-btn/primary-btn.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { PaymentService } from '../../services/payment.service';
import { ShopService } from '../../services/shop.service';
import { ValidationService } from '../../services/validation.service';
import { ShopStore } from '../../stores/shop.store';

@Component({
  selector: 'app-create-shop',
  standalone: true,
  imports: [
    FloatLabelModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    PrimaryBtnComponent
  ],
  templateUrl: './create-shop.component.html',
  styleUrl: './create-shop.component.scss'
})
export class CreateShopComponent {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private errorService: ErrorService,
    private shopService: ShopService,
    private shopStore: ShopStore,
    private authService: AuthService
  ) {}

  form!: FormGroup;

  creating: boolean = false

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, ValidationService.emailValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: ValidationService.checkPasswords }
    );
  }

  async generateSlug(name: string): Promise<string> {
    let baseSlug = this.createSlugFromName(name); // Crea lo slug base dal nome
    let slug = baseSlug;
    let counter = 1;

    while (!(await this.isSlugAvailable(slug))) {
      slug = `${baseSlug}-${counter}`; // Usa sempre il baseSlug con il counter
      counter++;
    }

    return slug; // Ritorna lo slug unico
  }

  // Funzione per creare lo slug a partire dal nome
  createSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Sostituisce caratteri non validi con '-'
      .replace(/(^-|-$)/g, ''); // Rimuove '-' iniziali e finali
  }

  // Funzione per verificare se lo slug è disponibile
  async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      this.shopStore.slug = slug; // Imposta lo slug nello store
      const response: any = await this.shopService.getShopPublic(); // Verifica lo slug

      return !(response && response.id); // Ritorna false se esiste, true se non trovato
    } catch (error) {
      console.error('Errore durante la verifica dello slug:', error);
      return true; // Se c'è un errore, lo consideriamo disponibile
    }
  }

  async create() {
    // Preveniamo richieste multiple se già in creazione
    if (this.creating) return;

    let v = this.form.value;

    // Controllo che tutti i campi siano compilati
    if (!v.name || !v.email || !v.password || !v.confirmPassword) {
      this.errorService.showError({
        label: 'Attenzione',
        message: 'Inserire tutti i campi',
      });
      return;
    }

    // Verifica che la password sia lunga almeno 8 caratteri
    if (v.password.length < 8) {
      this.errorService.showError({
        label: 'Errore Password',
        message: 'La password deve essere di almeno 8 caratteri',
      });
      return;
    }

    // Verifica che le password coincidano
    if (v.password !== v.confirmPassword) {
      this.errorService.showError({
        label: 'Errore Password',
        message: 'Le password non coincidono',
      });
      return;
    }

    this.creating = true; // Imposta lo stato a "in creazione"

    try {
      // Crea l'oggetto con i dati per l'update
      const shop = {
        name: v.name,
        email: v.email,
        password: v.password,
        slug: await this.generateSlug(v.name), // Genera lo slug
      };

      // Esegui la chiamata all'API per la create
      await this.shopService.createFreeTrial(shop).toPromise()

      // Esegui il login con i nuovi dati
      const res = await this.authService.login(v.email, v.password).toPromise();

      // Aggiorna lo store con i dati restituiti dal login
      this.shopStore.shopId = res.shopId;
      this.shopStore.slug = res.slug;

      // Salva i dati nel localStorage
      localStorage.setItem('shopId', this.shopStore.shopId.toString());
      localStorage.setItem('slug', this.shopStore.slug);

      // Reindirizza alla pagina privata
      this.router.navigate([`private/${this.shopStore.slug}`]);

    } catch (error: any) {
      // Gestione dell'errore se qualcosa va storto
      console.error('Errore durante l\'aggiornamento:', error);
      this.errorService.showError({
        label: 'Errore',
        message: `Esiste già un profilo con questo indirizzo email`,
      });
    } finally {
      // Ritorna lo stato a "non in creazione"
      this.creating = false;
    }
  }
}
