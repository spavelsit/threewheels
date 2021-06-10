import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Position } from 'src/app/common/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrEditPositionModuleComponent } from 'src/app/common/modules/create-or-edit-position-module/create-or-edit-position-module.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { PositionService } from 'src/app/common/services/position.service';
import { Subscription } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService } from 'src/app/common/services/order.service';

interface Query {
  limit: number
  offset: number
  search?: string
}

@Component({
  selector: 'app-position-page',
  templateUrl: './position-page.component.html',
  styleUrls: ['./position-page.component.scss']
})
export class PositionPageComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public sharedService: SharedService,
    public positionService: PositionService,
    private route: ActivatedRoute,
    public orderService: OrderService
  ) { }

  oSub: Subscription

  @ViewChild('matTable') table: MatTable<Element>
  
  limit = this.sharedService.offset
  offset = 0

  ngOnInit(): void {
    this.positionService.positions = []
    window.addEventListener('scroll', this.scroll.bind(this), true);

    if (!window.location.search.includes('search')) {
      this.fetch(true)
    }

    this.oSub = this.route.queryParams.subscribe((params: Params) => {
      const search = params.search ? params.search : ''
      
      if (search || search.length !== 0) {
        this.onSearch()
      }

      if (this.sharedService.search.deleted) {
        this.sharedService.search.deleted = false
        this.onSearch()
      }
    });
  }

  onSearch() {
    this.offset = 0
    this.positionService.positions = []
    this.positionService.preloader = true

    this.fetch(true)
  }

  fetch(status = false) {
    const params: Query = {
      limit: this.limit,
      offset: this.offset
    }

    if (window.location.search.includes('search')) {
      params.search = window.location.search.split('=')[1]
    }


    this.oSub = this.positionService.getAll(params).subscribe(callback => {
      this.positionService.preloader = false

      this.positionService.positions = this.positionService.positions.concat(callback.results)
      this.positionService.noMoreElement = this.limit !== callback.count
      this.positionService.loaderMore = false
      this.offset += this.limit

      if (this.orderService.positionToOrder.length !== 0) {
        this.orderService.positionToOrder.map(position => {
          const candidate = this.positionService.positions.find(el => position.position === el.id)

          if (candidate) candidate.quantity = position.amount - position.quantity
        })
      }

      if (status) this.positionService.table = this.table
    })
  }

  scroll(event) {
    if (event.srcElement.classList.contains("mat-drawer-content")) {
      if (event.srcElement.scrollTopMax - 200 < event.srcElement.scrollTop && !this.positionService.noMoreElement) {
        this.positionService.noMoreElement = true
        this.positionService.loaderMore = true
        this.fetch()
      }
    }
  }

  editPositionModalOpen(position: Position) { 
    this.dialog.open(CreateOrEditPositionModuleComponent, {
      width: '780px',
      data: { type: 'edit', position }
    });
  }

  printQRCode(position: Position) {  }

  addPositonToCart(position: Position) { 
    return this.orderService.addCartPositionToOrder(position)
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
    window.removeEventListener('scroll', this.scroll, true);
    this.positionService.positions = []
    this.positionService.preloader = true
    this.positionService.table = null
    this.sharedService.search.string = ''
  }
}
