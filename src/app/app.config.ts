import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';
import { routes } from './app.routes';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';


const firebaseConfig = {
  apiKey: "AIzaSyB5bMyE40Lxqu3lLPcDaL_QJpXf8bcdybk",
  authDomain: "appointment-app-a53b0.firebaseapp.com",
  projectId: "appointment-app-a53b0",
  storageBucket: "appointment-app-a53b0.firebasestorage.app",
  messagingSenderId: "964620599559",
  appId: "1:964620599559:web:22a9bdd9706a69b883c5a2"
};

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const provideTranslation = () => ({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    importProvidersFrom(RouterModule.forRoot(routes)),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage())
  ]
};
