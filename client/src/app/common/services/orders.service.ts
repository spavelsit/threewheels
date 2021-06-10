import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Position, OrderPosition } from '../interfaces';
import { VariableService } from './variable.service';
import { MaterialService } from '../utils/material.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient, private variable: VariableService) { }

  public fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  public addItemCart(position: Position) {
    if (position.quantity === 0) {MaterialService.toast('Нет в наличии'); return; }

    position.quantity--;

    const order: OrderPosition = {
      itemID: position._id,
      name: position.name,
      article: position.article,
      cost: position.cost,
      orderCost: position.orderCost,
      quantity: 1
    };

    const candidate = this.variable.arrayOrders.find(item => item.itemID === order.itemID);

    MaterialService.toast('Товар добавлен в корзину');
    if (candidate) {
      candidate.quantity++;
      return;
    }

    this.variable.arrayOrders.push(order);
  }
}
