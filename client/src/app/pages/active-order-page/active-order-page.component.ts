import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/common/services/order.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/common/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-active-order-page',
  templateUrl: './active-order-page.component.html',
  styleUrls: ['./active-order-page.component.scss']
})
export class ActiveOrderPageComponent implements OnInit, OnDestroy {

  constructor(
    private orderService: OrderService,
    public sharedService: SharedService,
    private snackBar: MatSnackBar
  ) { }

  orders: Order[] = []

  oSub: Subscription

  limit = this.sharedService.offset
  offset = 0

  filter = {
    number: null,
    phone: null,
    date: {
      start: null,
      end: null
    }
  }

  status = {
    preloader: true,
    noMoreElement: false,
    loaderMore: false
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll.bind(this), true);
    this.fetch()
  }

  fetch() {
    const params:any = {
      status: 'pending',
      limit: this.limit,
      offset: this.offset
    }

    if (this.filter.phone) params.phone = this.filter.phone
    if (this.filter.number) params.order = this.filter.number
    if (this.filter.date.start) params.start = this.filter.date.start
    if (this.filter.date.end) params.end = this.filter.date.end

    this.oSub = this.orderService.getAll(params).subscribe(callback => {
      this.orders = this.orders.concat(callback.results)
      this.status.preloader = false
      this.status.loaderMore = false
      this.status.noMoreElement = this.limit !== callback.count
    })
  }

  scroll(event) {
    if (event.srcElement.classList.contains("mat-drawer-content")) {
      if (event.srcElement.scrollTopMax - 200 < event.srcElement.scrollTop && !this.status.noMoreElement) {
        this.status.noMoreElement = true
        this.status.loaderMore = true
        this.fetch()
      }
    }
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
    this.orders = []
  }

  searchInput(type) {
    const clearDate = () => {
      this.filter.date = {
        start: null,
        end: null
      }
    }

    if (type === 'phone') {
      clearDate()
      this.filter.number = null
    }

    if (type === 'order') {
      clearDate()
      this.filter.phone = null
    }

    if (type === 'date') {
      this.filter.phone = null
      this.filter.number = null

      if ((this.filter.date.start && this.filter.date.end) && this.filter.date.start > this.filter.date.end) {
        setTimeout(() => {
          this.filter.date.end = null
        }, 300)
        this.snackBar.open('Дата начала не может быть больше даты конца')
      }
    }
    
    this.status.preloader = true
    this.orders = []
    this.fetch()
  }

  calcOrderPrice(order: Order) {
    const cost_of_work = order.companion ? order.companion.cost_of_work : 0
    const positions = this.sharedService.calcOrderPrice(order.positions)
    const sale = this.sharedService.calcPercent(cost_of_work + positions, order.detail.sale)

    return (cost_of_work + positions) - sale
  }

}
