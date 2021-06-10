import { Injectable } from '@angular/core';
import { Position, OrderPosition } from '../interfaces';

@Injectable({providedIn: 'root'})

export class VariableService {
  constructor() {}

  public homePage = '/positions';

  public links = [
    {url: '/history-order', name: 'История заказов'},
    {url: '/active-order', name: 'Активные заказы'},
    {url: '/implements', name: 'Реализация за период'},
  ];

  public totalPrice = 0;

  public arrayPosition: Position[] = [];
  public noMorePosition = false;
  public preloaderPosition = false;

  public arrayOrders: OrderPosition[] = [];
}
