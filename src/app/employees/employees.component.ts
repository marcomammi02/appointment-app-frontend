import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {EmployeesService} from "../services/employees.service";
import {Button} from "primeng/button";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [TableModule, Button, HttpClientModule, RouterLink],
  providers: [EmployeesService],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit{
  constructor(private employeesService: EmployeesService) {}
  employees: any

  ngOnInit() {
    this.employeesService.getEmployees().subscribe(res => this.employees = res)
  }

  delete(employee: any) {
    this.employeesService.delete(employee.id).subscribe()
    this.employeesService.getEmployees().subscribe(res => this.employees = res)
  }
}
