import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { tokenInterceptor } from './shared/classes/token.interceptor';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { HistoryListComponent } from './pages/history-page/history-list/history-list.component';
import { HistoryFilterComponent } from './pages/history-page/history-filter/history-filter.component';
import { PreloaderComponent } from './shared/modules/preloader/preloader.component';
import { PositionsPageComponent } from './pages/positions-page/positions-page.component';
import { ProductBlockComponent } from './pages/positions-page/product-block/product-block.component';
import { ProductListComponent } from './pages/positions-page/product-block/product-list/product-list.component';
import { ProductFilterComponent } from './pages/positions-page/product-block/product-filter/product-filter.component';
import { CartModuleComponent } from './pages/positions-page/cart-module/cart-module.component';
import { PrintComponent } from './shared/modules/print/print.component';
import { QrcodeComponent } from './shared/modules/qrcode/qrcode.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ImplementsPageComponent } from './pages/implements-page/implements-page.component';
import { ImplementsFilterComponent } from './pages/implements-page/implements-filter/implements-filter.component';
import { ImplementsListComponent } from './pages/implements-page/implements-list/implements-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SiteLayoutComponent,
    HistoryPageComponent,
    HistoryListComponent,
    HistoryFilterComponent,
    PreloaderComponent,
    PositionsPageComponent,
    ProductBlockComponent,
    ProductListComponent,
    ProductFilterComponent,
    CartModuleComponent,
    PrintComponent,
    QrcodeComponent,
    OverviewPageComponent,
    ImplementsPageComponent,
    ImplementsFilterComponent,
    ImplementsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: tokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
