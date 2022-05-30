import { InvoiceComponent } from './invoice/invoice.component';
import { PropertyComponent } from './property/property.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './tenant/tenant.component';

const routes: Routes = [
  {path: 'user', component: UserComponent},
  {path: '', redirectTo: "login", pathMatch:"full"},
  {path: 'login', component: LoginComponent},
  {path: 'property', component: PropertyComponent},
  {path: 'tenant', component: TenantComponent},
  {path: 'invoice', component: InvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
