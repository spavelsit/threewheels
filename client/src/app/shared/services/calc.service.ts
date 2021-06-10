import { Injectable } from '@angular/core';
import { Order} from '../intefaces';
import { VariablesService } from './variables.service';

@Injectable({ providedIn: 'root' })

export class CalcService {

  constructor(private array: VariablesService) { }

  public price(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
  public orderCost(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.orderCost;
    }, 0);
  }

  public quantity() {
    this.array.cart.map(item => {
      const candidate = this.array.products.find(p => p._id === item.itemID);
      if (candidate) {
        candidate.quantity = candidate.genQuantity - item.quantity;
      }
    });
  }

  public cartCost(): number {
    return this.array.cart.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  public cartSale(sale: {rub: number; percent: number} = { rub: 0, percent: 0 }) {
    return {
      percent: +((sale.rub / this.cartCost()) * 100).toFixed(1),
      rub: +(this.cartCost() * (sale.percent / 100)).toFixed(0)
    };
  }
}
