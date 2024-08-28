import { Routes } from '@angular/router';
import {EmployeesComponent} from "./employees/employees.component";
import {CreateEmployeeComponent} from "./employees/create-employee/create-employee.component";

export const routes: Routes = [
  {path: 'employees', children: [
      {path: '', component: EmployeesComponent},
      {path: 'create', component: CreateEmployeeComponent},
    ]},
];
