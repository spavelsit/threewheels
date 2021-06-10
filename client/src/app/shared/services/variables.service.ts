import { Injectable } from '@angular/core';
import { Position, OrderPosition, Print, Order } from '../intefaces';

@Injectable({ providedIn: 'root' })

export class VariablesService {
  constructor() {}

  public links = [
    {url: '/home', name: 'Статистика'},
    {url: '/implements', name: 'Реализация за период'},
    {url: '/history', name: 'История заказов'},
    {url: '/positions', name: 'Магазин', queryParams: {type: 'product'}},
    {url: '/positions', name: 'Покраска', queryParams: {type: 'colors'}},
  ];

  public products: Position[] = [];
  public colors: Position[] = [];

  public cart: OrderPosition[] = [];

  public printItem: Print = null;
  public printQRCode: Position = null;

  public noMoreOrders = false;


}
