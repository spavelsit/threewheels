import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './common/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ImplementsPageComponent } from './pages/implements-page/implements-page.component';
import { TokenInterceptor } from './common/utils/token.interceptor';
import { HistoryOrderPageComponent } from './pages/history-order-page/history-order-page.component';
import { ActiveOrderPageComponent } from './pages/active-order-page/active-order-page.component';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import { PreloaderModuleComponent } from './common/modules/preloader-module/preloader-module.component';
import { LoaderMoreModuleComponent } from './common/modules/loader-more-module/loader-more-module.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    LoginPageComponent,
    ImplementsPageComponent,
    HistoryOrderPageComponent,
    ActiveOrderPageComponent,
    PositionsPageComponent,
    PreloaderModuleComponent,
    LoaderMoreModuleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
