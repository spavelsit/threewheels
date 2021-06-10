import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { VariablesService } from 'src/app/shared/services/variables.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html'
})
export class ProductFilterComponent implements OnDestroy {

  constructor(private positionsService: PositionsService, private array: VariablesService) { }

  private oSub: Subscription;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFilter = new EventEmitter();

  text: string;
  filtered = false;

  onInput(event: any) {

    this.array.noMoreOrders = true;

    if (event.explicitOriginalTarget.value.length === 0) {
      this.onClear();
      return;
    }
    this.filtered = true;

    this.positionsService.find({ text: event.explicitOriginalTarget.value}).subscribe(items => {
      if (items.length === 0) {
        MaterialService.toast('Совпадений не найдено');
      }

      this.array.products = items;

      return items.map(el => {
        const candidate = this.array.cart.find(item => item.itemID === el._id);

        el.genQuantity = el.quantity;
        el.selQuantity = 1;

        if (candidate) { el.quantity -= candidate.quantity; }

      });
    });
  }

  onClear() {
    this.filtered = false;
    this.text = null;
    this.array.products = [];
    this.onFilter.emit();
  }

  ngOnDestroy() {
    if (this.oSub) { this.oSub.unsubscribe(); }
  }
}
