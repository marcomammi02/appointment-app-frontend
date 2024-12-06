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

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: ':shopId', component: PublicComponent},
  {path: ':shopId/service/:serviceId', component: BookingPageComponent},
  {path: ':shopId/service/:serviceId/datas', component: DataPageComponent},
  {path: 'private/:shopId',
    component: CmsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'appointments', component: CalendarComponent },
      {path: 'appointments/create', component: CreateAppComponent },
      {path: 'appointments/:appId', component: EditAppComponent },
      {path: 'staff', component: StaffComponent },
      {path: 'staff/create', component: CreateStaffComponent },
      {path: 'staff/:staffId', component: EditStaffComponent },
      {path: 'services', component: ServicesComponent },
      {path: 'services/create', component: CreateServiceComponent },
      {path: 'services/:serviceId', component: EditServiceComponent },
      {path: 'profile', component: ProfileComponent},
      {path: '', redirectTo: 'appointments', pathMatch: 'full'}
    ]},
  {path: '**', redirectTo: 'login'},
  {path: '', redirectTo: 'login', pathMatch: "full"}
];

export const appProviders = [
  provideHttpClient(withInterceptors([authInterceptor])),
];
