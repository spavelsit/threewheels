import { Component, AfterViewInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';
import { FunctionsService } from '../../services/functions.service';
import { CalcService } from '../../services/calc.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html'
})
export class PrintComponent implements AfterViewInit {

  constructor(public variables: VariablesService, public calc: CalcService ) { }

  public date = new Date().toISOString();

  public product = {
    list: this.variables.printItem.item.list.filter(item => item.type === 'product'),
    calc: (() => this.calc.price(this.product))
  };
  public service = {
    list: this.variables.printItem.item.list.filter(item => item.type === 'service'),
    calc: (() => this.calc.price(this.service))
  };

  sale(price: number) {
    const sale = this.variables.printItem.item.sale;

    return +(price * (sale / 100)).toFixed(0);
  }

  ngAfterViewInit() {
    window.print();
    setTimeout(() => { this.variables.printItem = null; }, 100);
  }
}
