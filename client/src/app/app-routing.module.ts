import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './common/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { ImplementPageComponent } from './pages/implement-page/implement-page.component';
import { PositionPageComponent } from './pages/position-page/position-page.component';
import { ActiveOrderPageComponent } from './pages/active-order-page/active-order-page.component';
import { CompanionPageComponent } from './pages/companion-page/companion-page.component';
import { AuthGuard } from './common/classes/auth.guard';


const routes: Routes = [
  {path: '', component: AuthLayoutComponent, children: [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent}
  ]},

  {path: '', component: MainLayoutComponent, canActivate: [AuthGuard], children: [
    {path: 'implements', component: ImplementPageComponent},
    {path: 'positions', component: PositionPageComponent},
    {path: 'active-orders', component: ActiveOrderPageComponent},
    {path: 'companions', component: CompanionPageComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
