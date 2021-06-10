import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PositionToOrder, Position, Order } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PositionService } from './position.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private positionService: PositionService
  ) { }

  public positionToOrder: PositionToOrder[] = []

  public addCartPositionToOrder(position: Position) {
    const positionToOrder: PositionToOrder = {
      position: position.id,
      name: position.name,
      article: position.article,
      cost: position.cost,
      cost_of_sale: position.cost_of_sale,
      quantity: 1,
      companion: '0',
      companion_percent: 0,
      amount: position.quantity,
      alias_id: position.alias_id
    }

    const candidate = this.positionToOrder.find(el => el.position === position.id)

    if (candidate) {
      if (candidate.quantity >= candidate.amount) {
        candidate.quantity = candidate.amount
        position.quantity = 0
      } else {
        candidate.quantity++
        position.quantity--
      }
    } else {
      position.quantity--
      this.positionToOrder.push(positionToOrder)
    }

    this.snackBar.open('Товар добавлен в корзину')

    localStorage.setItem('positionToOrder', JSON.stringify(this.positionToOrder))
  }

  deletecCartPositionToOrder(position: PositionToOrder) {
    const idx = this.positionToOrder.findIndex(el => el.position === position.position)
    const candidate = this.positionService.positions.find(el => el.id === position.position)

    this.positionToOrder.splice(idx, 1)

    if (candidate) {
      candidate.quantity = position.amount
    }

    localStorage.setItem('positionToOrder', JSON.stringify(this.positionToOrder))
  }
  
  changeCartQuantityPositionToOrder(position: PositionToOrder) {
    const candidate = this.positionService.positions.find(el => el.id === position.position)

    if (position.quantity <= 0) {
      position.quantity = 1
    }

    if (position.quantity >= position.amount) {
      position.quantity = position.amount
    }

    if (candidate) {
      candidate.quantity = position.amount - position.quantity
    }

    localStorage.setItem('positionToOrder', JSON.stringify(this.positionToOrder))
  }


  create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/v1/order/create', order)
  }

  public getAll(params = {}): Observable<{count: number; results: Order[]}> {
    return this.http.get<{count: number; results: Order[]}>('/api/v1/order/all', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  public count(): Observable<{count: number;}> {
    return this.http.get<{count: number;}>('/api/v1/order/count')
  }

}
