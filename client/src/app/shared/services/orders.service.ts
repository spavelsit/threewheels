import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order, OrderPosition, Position } from '../intefaces';
import { Observable } from 'rxjs';
import { VariablesService } from './variables.service';
import { CalcService } from './calc.service';
import { MaterialService } from '../classes/material.service';

@Injectable({ providedIn: 'root' })

export class OrdersService {
  constructor(private http: HttpClient, private array: VariablesService, private calc: CalcService) { }

  public addItemCart(item: Position) {

    const element: OrderPosition = Object.assign({}, {
      name: item.name,
      article: item.article,
      cost: item.orderCost,
      orderCost: item.cost,
      quantity: item.selQuantity,
      amout: item.genQuantity,
      type: item.type,
      itemID: item._id
    });

    const candidate = this.array.cart.find(el => el.itemID === element.itemID);

    if (item.quantity >= item.selQuantity) {
      if (candidate) {
        candidate.quantity = +element.quantity + (+candidate.quantity);
      } else {
        this.array.cart.push(element);
      }
    } else {
      element.quantity = item.selQuantity = item.quantity;
      if (candidate) {
        candidate.quantity = +element.quantity + (+candidate.quantity);
      } else {
        this.array.cart.push(element);
      }
    }

    MaterialService.toast(`Добавлено х${element.quantity ? element.quantity : 1}`);
    this.calc.quantity();
  }

  public changeItemQuantity(item: OrderPosition) {
    const candidate = this.array.products.find(el => el._id === item.itemID);

    if (item.quantity > candidate.genQuantity) {
      item.quantity = candidate.genQuantity;
      MaterialService.toast(`Максимальное колличество х${candidate.genQuantity}`);
    }

    this.calc.quantity();
  }

  public removeItemCart(item: OrderPosition) {
    const idx = this.array.cart.findIndex(p => p.itemID === item.itemID);

    if (this.array.products.length !== 0) {
      const candidate = this.array.products.find(el => el._id === item.itemID);

      if (candidate) { candidate.quantity = +item.quantity + (+candidate.quantity); }
    }

    this.array.cart.splice(idx, 1);
  }

  public clearCart() {
    let clear = 0;
    this.array.cart.map(item => {
      if (this.array.products.length !== 0) {
        const candidate = this.array.products.find(el => el._id === item.itemID);

        if (candidate) { candidate.quantity = +item.quantity + (+candidate.quantity); }
      }
      clear++;
    });

    if (clear === this.array.cart.length) {
      this.array.cart = [];
    }
  }

  public create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }

  public fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  update(order: Order): Observable<Order> {
    return this.http.patch<Order>(`/api/order/${order._id}`, order);
  }

  delete(order: Order): Observable<Order> {
    return this.http.delete<Order>(`/api/order/${order._id}`);
  }
}
