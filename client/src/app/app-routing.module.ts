import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './common/layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { ImplementsPageComponent } from './pages/implements-page/implements-page.component';
import { AuthGuard } from './common/utils/auth.guard';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import { HistoryOrderPageComponent } from './pages/history-order-page/history-order-page.component';
import { ActiveOrderPageComponent } from './pages/active-order-page/active-order-page.component';


const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent }
    ]
  },

  {path: '', component: MainLayoutComponent, canActivate: [AuthGuard], children: [
    {path: 'implements', component: ImplementsPageComponent},
    {path: 'positions', component: PositionsPageComponent},
    {path: 'history-order', component: HistoryOrderPageComponent},
    {path: 'active-order', component: ActiveOrderPageComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
