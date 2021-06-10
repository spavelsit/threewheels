import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrEditPositionModuleComponent } from '../../modules/create-or-edit-position-module/create-or-edit-position-module.component';
import { CreateOrEditCompanionModuleComponent } from '../../modules/create-or-edit-companion-module/create-or-edit-companion-module.component';
import { CreateOrEditOrderModuleComponent } from '../../modules/create-or-edit-order-module/create-or-edit-order-module.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  oSub: Subscription

  constructor(
    public sharedService: SharedService,
    public orderService: OrderService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) { }
  
  preloader = false

  ngOnInit(): void {
    
    if (localStorage.getItem('positionToOrder')) {
      this.orderService.positionToOrder = JSON.parse(localStorage.getItem('positionToOrder'))
    }

    this.sharedService.search.string = window.location.search.includes('search') ? window.location.search.split('=')[1] : ''

    this.oSub = this.sharedService.getTotal().subscribe(callback => {
      this.sharedService.totalPrice = callback.result ? callback.result : 0

      this.preloader = true
    })
  }

  linkModalOpen(type: string) {
    switch (type) {
      case 'positions':
        this.openModalPosition()
        break;
      case 'companions':
        this.openModalCompanion()
        break;
    }
  }


  openModalPosition() {
    this.dialog.open(CreateOrEditPositionModuleComponent, {
      width: '780px',
      data: { type: 'create' }
    });
  }

  openModalCompanion() {
    this.dialog.open(CreateOrEditCompanionModuleComponent, {
      width: '780px',
      data: { type: 'create' }
    });
  }

  openModalOrder() {
    this.dialog.open(CreateOrEditOrderModuleComponent, {
      width: '920px',
      data: { type: 'create' }
    });
  }

  inputSearch($event) {
    if ($event.target.value.length === 0) {
      return this.clearSearchField()
    }
    
    this.router.navigate(['/positions'], {queryParams: {search: $event.target.value}})
  }

  clearSearchField() {
    this.router.navigate([], {})
    this.sharedService.search.string = ''
    this.sharedService.search.deleted = true
  }

  logout() {
    this.oSub = this.authService.logout().subscribe(() => {
      localStorage.removeItem('auth-token')
      this.router.navigate(['/login'])
    })
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
