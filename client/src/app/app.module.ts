import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxMaskModule, IConfig } from 'ngx-mask'

import {MatInputModule} from '@angular/material/input'; 
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatBadgeModule} from '@angular/material/badge'; 
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter} from '@angular/material/core';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ActiveOrderPageComponent } from './pages/active-order-page/active-order-page.component';
import { PositionPageComponent } from './pages/position-page/position-page.component';
import { CompanionPageComponent } from './pages/companion-page/companion-page.component';
import { TokenInterceptor } from './common/classes/token.interceptor';
import { MainLayoutComponent } from './common/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './common/layouts/auth-layout/auth-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImplementPageComponent } from './pages/implement-page/implement-page.component';
import { CreateOrEditPositionModuleComponent } from './common/modules/create-or-edit-position-module/create-or-edit-position-module.component';
import { CreateOrEditCompanionModuleComponent } from './common/modules/create-or-edit-companion-module/create-or-edit-companion-module.component';
import { CreateOrEditOrderModuleComponent } from './common/modules/create-or-edit-order-module/create-or-edit-order-module.component';
import { AddPositionToOrderModuleComponent } from './common/modules/add-position-to-order-module/add-position-to-order-module.component';
import { CustomDateAdapter } from './common/classes/custom.date.adapter';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ActiveOrderPageComponent,
    PositionPageComponent,
    CompanionPageComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    ImplementPageComponent,
    CreateOrEditPositionModuleComponent,
    CreateOrEditCompanionModuleComponent,
    CreateOrEditOrderModuleComponent,
    AddPositionToOrderModuleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    NgxMaskModule.forRoot(maskConfig),

    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTableModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, horizontalPosition: 'left'}},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
    {provide: DateAdapter, useClass: CustomDateAdapter}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
