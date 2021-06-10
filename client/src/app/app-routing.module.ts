import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import {OverviewPageComponent} from "./pages/overview-page/overview-page.component";
import {ImplementsPageComponent} from "./pages/implements-page/implements-page.component";

const routes: Routes = [
  {path: '', children: [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent},
  ]},

  {path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
    {path: 'home', component: OverviewPageComponent},
    {path: 'implements', component: ImplementsPageComponent},
    {path: 'history', component: HistoryPageComponent},
    {path: 'positions', component: PositionsPageComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
