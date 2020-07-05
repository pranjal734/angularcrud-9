import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { ListEmployeesComponent } from './list-employees.component';
import { CreateEmployeeComponent } from './create-employee.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    EmployeeRoutingModule, SharedModule,
  ],
  declarations: [ ListEmployeesComponent, CreateEmployeeComponent ]

})
export class EmployeeModule { }
