import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesViewComponent } from './pages/employees-view/employees-view.component';
import { EmployeesFormComponent } from './pages/employees-form/employees-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/employees',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    component: EmployeesViewComponent
  },
  {
    path: 'employees/form',
    component: EmployeesFormComponent
  },
  {
    path: 'employees/form/:id',
    component: EmployeesFormComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
