import { Injectable } from "@angular/core";
import { link, PositionToOrder } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material/table';

@Injectable({providedIn: 'root'})

export class SharedService {

  constructor(
    private http: HttpClient
  ) {}

  public offset = 30

  public search = {
    string: '',
    deleted: false
  }

  public links: link[] = [
    {url: 'positions', name: 'Магазин', has_button: true, tooltip_button: 'Добавить товар' },
    {url: 'active-orders', name: 'Заказы', has_button: false },
    {url: 'companions', name: 'Сотрудники', has_button: true, tooltip_button: 'Добавить сотрудника' },
    {url: 'implements', name: 'Реализация за период', has_button: false },
  ]

  public totalPrice: number = 0

  public getTotal(): Observable<{count: number; result: number}> {
    return this.http.get<{count: number; result: number}>('/api/v1/position/total')
  }

  renderRows(table: MatTable<any>) {
    table.renderRows()
  }

  public genereteAliasId() {
    const date = Date.now()

    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz" + date

    for( let i = 0; i < 24 - date.toString().length; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    
    return text + date;
  }

  calcOrderPrice(positions: PositionToOrder[]) {
    return positions.reduce((total, item) => {
      return total += item.quantity * item.cost_of_sale
    }, 0)
  }

  calcPercent(number, percent) {
    return +number / 100 * +percent
  }
}