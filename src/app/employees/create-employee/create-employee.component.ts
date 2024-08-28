import {Component, OnInit} from '@angular/core';
import {FloatLabelModule} from "primeng/floatlabel";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {TableModule} from "primeng/table";
import {CreateEmployee, EmployeesService} from "../../services/employees.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    Button,
    RouterLink,
    TableModule,
    HttpClientModule
  ],
  providers: [EmployeesService],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, private employeesService: EmployeesService) {
  }

  form!: FormGroup

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formbuilder.group({
      name: '',
      lastname: '',
      role: ''
    })
  }

  create() {
    let value = this.form.value
    const employee: CreateEmployee = {
      name: value.name,
      lastname: value.lastname,
      role: value.role
    }
    this.employeesService.create(employee).subscribe()
  }
}
