import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {OrdersService} from "../../shared/services/orders.service";
import {Order} from "../../shared/intefaces";

@Component({
  selector: 'app-implements-page',
  templateUrl: './implements-page.component.html'
})
export class ImplementsPageComponent implements OnInit, OnDestroy {

  constructor(
    private orders: OrdersService
  ) { }

  private oSub: Subscription;

  public array: Order[] = [];

  public filter: any = {};

  ngOnInit(): void {
    this.fetch();
  }

  fetch(): void {
    const params = Object.assign({}, this.filter, {
      limit: this.isFiltered() ? null : 20
    });

    this.oSub = this.orders.fetch(params).subscribe(order_list => {
      order_list.map(order => {
        order.list.map(item => this.array.push({date: order.date, sale: order.sale, mechanic: order.mechanic, percent: order.percent, item}));
      });
    });
  }

  applyFilter(filter: any): void {
    this.array = [];
    this.filter = filter;
    this.fetch();
  }


  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe();
  }
}
