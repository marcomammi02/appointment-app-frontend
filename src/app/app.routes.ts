import { Routes } from '@angular/router';
import {CmsComponent} from "./components/cms/cms.component";
import {CalendarComponent} from "./components/cms/calendar/calendar.component";
import {ServicesComponent} from "./components/cms/services/services.component";
import {CreateServiceComponent} from "./components/cms/services/create-service/create-service.component";
import {EditServiceComponent} from "./components/cms/services/edit-service/edit-service.component";

export const routes: Routes = [
  {path: 'private', component: CmsComponent, children: [
      {path: 'appointments', component: CalendarComponent },
      {path: 'services', component: ServicesComponent },
      {path: 'services/create', component: CreateServiceComponent },
      {path: 'services/:serviceId', component: EditServiceComponent },
      {path: '', redirectTo: 'appointments', pathMatch: 'full'}
    ]},
];
