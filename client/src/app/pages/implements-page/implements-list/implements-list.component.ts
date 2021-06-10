import {Component, Input} from '@angular/core';
import {Order} from "../../../shared/intefaces";

@Component({
  selector: 'app-implements-list',
  templateUrl: './implements-list.component.html'
})
export class ImplementsListComponent {

  constructor() { }

  @Input() implement: Order[];

  public calcOne(item, type) {
    switch (type) {
      case 'orderCost':
        return item.item.orderCost;
      case 'cost':
        return +((item.item.cost * ((100 - item.sale) / 100)).toFixed(0));
      case 'mechanic':
        return +(((this.calcOne(item, 'cost') - item.item.orderCost) * item.percent) / 100).toFixed(1);
      case 'difference':
        return +((item.item.cost * ((100 - item.sale) / 100)).toFixed(0)) - item.item.orderCost;
    }
  }
  public calc(type: string): number {

    return this.implement.reduce((total, item) => {
      switch (type) {
        case 'orderCost':
          return total += item.item.orderCost * item.item.quantity;
        case 'cost':
          return  total += this.calcOne(item, 'cost') * item.item.quantity;
        case 'quantity':
          return total += item.item.quantity;
        case 'mechanic':
          return total += item.mechanic ? this.calcOne(item, 'mechanic') * item.item.quantity : 0;
        case 'service':
          return total += ((this.calcOne(item, 'cost') - item.item.orderCost) * item.item.quantity)
            - (item.mechanic ? this.calcOne(item, 'mechanic') * item.item.quantity : 0);
      }
    }, 0);
  }

}
