import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Order, OrderPosition } from 'src/app/shared/intefaces';
import { CalcService } from 'src/app/shared/services/calc.service';
import { VariablesService } from 'src/app/shared/services/variables.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { Subscription } from 'rxjs';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html'
})
export class HistoryListComponent implements OnInit, OnDestroy {


  @Input() orders: Order[];


  private wSub: Subscription;
  private pSub: Subscription;
  private rSub: Subscription;
  private posSub: Subscription;

  constructor(
    public calc: CalcService,
    public variables: VariablesService,
    public functions: FunctionsService,
    private ordersService: OrdersService,
    private positionsService: PositionsService
  ) { }

  ngOnInit() {
  }

  public openChildren(event: any) {
    const element = event.target.parentElement.parentElement;
    if (element.classList.contains('positions-item__arrow')) {
      element.parentElement.parentElement.classList.toggle('active');
      return;
    } else if (element.classList.contains('positions-item')) {
      element.parentElement.classList.toggle('active');
      return;
    }
    element.classList.toggle('active');
  }

  public onReturn(order: Order, item: OrderPosition) {
    const idx = order.list.findIndex(orderPosition => orderPosition._id === item._id);
    const candidate = order.list.find(orderPosition => orderPosition._id === item._id);
    const check = confirm(`Произвести возврат на сумму ${candidate.cost} руб?`);

    if (!check) { return; }

    if (candidate && candidate.quantity > 1) {
      candidate.quantity--;
    } else if (candidate) {
      order.list.splice(idx, 1);
    }

    if (candidate && candidate.type === 'product') { this.positionsService.quantity(candidate.itemID).subscribe(); }

    this.rSub = this.ordersService.update(order).subscribe(() => {
      MaterialService.toast(`Возврат на сумму ${candidate.cost} руб произведен успешно`);

    });

    if (order.list.length === 0) {
      this.rSub = this.ordersService.delete(order).subscribe(() => {
        const index = this.orders.findIndex(i => i._id === order._id);
        this.orders.splice(index, 1);
        MaterialService.toast(`Заказ успешно отменен`);
      });
    }
  }

  ngOnDestroy() {
    if (this.wSub) { this.wSub.unsubscribe(); }
    if (this.pSub) { this.pSub.unsubscribe(); }
    if (this.rSub) { this.rSub.unsubscribe(); }
    if (this.posSub) { this.rSub.unsubscribe(); }
  }

}
