import { Routes } from '@angular/router';
import {CmsComponent} from "./components/cms/cms.component";
import {CalendarComponent} from "./components/cms/calendar/calendar.component";
import {ServicesComponent} from "./components/cms/services/services.component";
import {CreateServiceComponent} from "./components/cms/services/create-service/create-service.component";
import {EditServiceComponent} from "./components/cms/services/edit-service/edit-service.component";
import {StaffComponent} from "./components/cms/staff/staff.component";
import {CreateStaffComponent} from "./components/cms/staff/create-staff/create-staff.component";
import {EditStaffComponent} from "./components/cms/staff/edit-staff/edit-staff.component";
import {CreateAppComponent} from "./components/cms/calendar/create-app/create-app.component";
import {EditAppComponent} from "./components/cms/calendar/edit-app/edit-app.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./http/auth.interceptor";
import {AuthGuard} from "./http/auth.guard";
import { ProfileComponent } from './components/cms/profile/profile.component';
import { PublicComponent } from './components/public/public.component';
import { BookingPageComponent } from './components/public/booking-page/booking-page.component';
import { DataPageComponent } from './components/public/booking-page/data-page/data-page.component';
import { ConfirmAppComponent } from './components/public/booking-page/data-page/confirm-app/confirm-app.component';
import { LinksComponent } from './components/cms/links/links.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ConfirmPaymentPageComponent } from './components/confirm-payment-page/confirm-payment-page.component';
import { AbsencesComponent } from './components/cms/staff/edit-staff/absences/absences.component';
import { CreateAbsComponent } from './components/cms/staff/edit-staff/absences/create-abs/create-abs.component';
import { PrivacyPolicyComponent } from './components/landing-page/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/landing-page/terms-and-conditions/terms-and-conditions.component';
import { Component } from '@angular/core';
import { DeleteAppComponent } from './components/public/booking-page/data-page/delete-app/delete-app.component';
import { EditAppPublicComponent } from './components/public/booking-page/data-page/edit-app-public/edit-app-public.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'terms-of-services', component: TermsAndConditionsComponent},
  {path: 'create-account', component: ConfirmPaymentPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: ':slug', component: PublicComponent},
  {path: ':slug/edit-appointment/:appointmentId', component: EditAppPublicComponent},
  {path: ':slug/delete-appointment/:appointmentId', component: DeleteAppComponent},
  {path: ':slug/service/:serviceId', component: BookingPageComponent},
  {path: ':slug/service/:serviceId/datas', component: DataPageComponent},
  {path: ':slug/service/:serviceId/datas/confirm', component: ConfirmAppComponent},
  {path: 'private/:slug',
    component: CmsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'appointments', component: CalendarComponent },
      {path: 'appointments/create', component: CreateAppComponent },
      {path: 'appointments/:appId', component: EditAppComponent },
      {path: 'staff', component: StaffComponent },
      {path: 'staff/create', component: CreateStaffComponent },
      {path: 'staff/:staffId', component: EditStaffComponent },
      {path: 'staff/:staffId/absences', component: AbsencesComponent},
      {path: 'staff/:staffId/absences/create', component: CreateAbsComponent},
      {path: 'services', component: ServicesComponent },
      {path: 'services/create', component: CreateServiceComponent },
      {path: 'services/:serviceId', component: EditServiceComponent },
      {path: 'profile', component: ProfileComponent},
      {path: 'qr-code', component: LinksComponent},
      {path: '', redirectTo: 'appointments', pathMatch: 'full'}
    ]},
  {path: '**', redirectTo: 'login'},
];

export const appProviders = [
  provideHttpClient(withInterceptors([authInterceptor])),
];
