import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order } from '../../shared/intefaces';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html'
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  private oSub: Subscription;
  public orders: Order[] = [];
  public reloading = false;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    const params = {};
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = orders;
      this.reloading = false;
    });
  }

  ngOnDestroy() {
    if (this.oSub) { this.oSub.unsubscribe(); }
  }
}
