import { Component, OnInit } from '@angular/core';
import { IEmployee } from './IEmployee';
import { EmployeeService } from './employee.service';
import { Router } from '@angular/router';
// import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];
  constructor(private employeeService: EmployeeService, private router: Router) { }
  // employees: Employee[] = [
  //   {
  //     id: 1,
  //     name: 'om',
  //     gender: 'male',
  //     contactPreference: 'phone',
  //     email: 'om24@gmail.com',
  //     dateOfBirth: new Date('04/01/1991'),
  //     department: 'IT',
  //     isActive: true,
  //     photoPath: 'assets/images/download.png'
  //   },
  //   {

  //     id: 2,
  //     name: 'rahul',
  //     gender: 'male',
  //     contactPreference: 'email',
  //     email: 'rahul7415@gmail.com',
  //     dateOfBirth: new Date('01/29/1992'),
  //     department: 'payroll',
  //     isActive: true,
  //     photoPath: 'assets/images/person-man.png'
  //   },
  //   {

  //     id: 3,
  //     name: 'shikha',
  //     gender: 'female',
  //     contactPreference: 'phone',
  //     email: 'shikha0734@gmail.com',
  //     dateOfBirth: new Date('05/01/1991'),
  //     department: 'HR',
  //     isActive: true,
  //     photoPath: 'assets/images/best-employee.webp'
  //   }

  // ];
  // constructor() { }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (err) => console.log(err)
    );
  }
  editButtonClick(employeeId: number) {
    this.router.navigate(['/employees/edit', employeeId]);
  }
}
