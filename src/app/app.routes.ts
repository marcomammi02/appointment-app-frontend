import { Routes } from '@angular/router';
import {CmsComponent} from "./components/cms/cms.component";
import {CalendarComponent} from "./components/cms/calendar/calendar.component";
import {ServicesComponent} from "./components/cms/services/services.component";

export const routes: Routes = [
  {path: 'private', component: CmsComponent, children: [
      {path: 'appointments', component: CalendarComponent },
      {path: 'services', component: ServicesComponent },
      {path: '', redirectTo: 'appointments', pathMatch: 'full'}
    ]},
];
