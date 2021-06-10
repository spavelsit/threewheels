import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { Position } from 'src/app/shared/intefaces';
import { VariablesService } from 'src/app/shared/services/variables.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {

  constructor(
    private ordersService: OrdersService,
    private positionsService: PositionsService,
    public array: VariablesService,
    public functions: FunctionsService
  ) { }

  private editItem: Position;
  public form: FormGroup;

  private oSub: Subscription;
  private dSub: Subscription;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      article: new FormControl(null),
      quantity: new FormControl(1, Validators.required),
      cost: new FormControl(null),
      orderCost: new FormControl(null),
      type: new FormControl(null)
    });
  }

  addCart(item: Position) {
    this.ordersService.addItemCart(item);
  }

  public openChildren(item: Position) {

    if (this.editItem && item._id !== this.editItem._id) {
      this.editItem.openItem = false;
    }

    this.editItem = item;
    item.openItem = !item.openItem;

    this.form.get('name').setValue(item.name);
    this.form.get('cost').setValue(item.cost);
    this.form.get('article').setValue(item.article);
    this.form.get('orderCost').setValue(item.orderCost);
    this.form.get('quantity').setValue(item.quantity);
    this.form.get('type').setValue(item.type);


  }

  onSubmit(item: Position) {
    const password = prompt('Введите пароль для изменения товара');

    if (password !== '1970') { return; }

    const position: Position = {
      _id: item._id,
      name: this.form.get('name').value,
      article: this.form.get('article').value,
      quantity: this.form.get('quantity').value,
      cost: this.form.get('cost').value,
      orderCost: this.form.get('orderCost').value,
      type: this.form.get('type').value
    };

    this.oSub = this.positionsService.update(position).subscribe(el => {
      MaterialService.toast('Товар успешно изменен');

      if (item.type !== this.form.get('type').value) {
        this.onDelete(el, true);
        return;
      }

      item.name = el.name;
      item.article = el.article;
      item.quantity = el.quantity;
      item.cost = el.cost;
      item.orderCost = el.orderCost;
      item.openItem = false;
    });
  }

  onDelete(item: Position, pass = false) {
    if (pass === true) {
      const idx = this.array.products.findIndex(el => el._id === item._id);

      this.array.products.splice(idx, 1);
      return;
    }

    const password = prompt('Введите пароль для удаления товара');

    if (password !== '1970' && pass !== false) { return; }

    this.dSub = this.positionsService.delete(item).subscribe(() => {
      const idx = this.array.products.findIndex(el => el._id === item._id);

      this.array.products.splice(idx, 1);

      MaterialService.toast('Товар успешно удален');
    });
  }

  ngOnDestroy() {
    if (this.oSub) { this.oSub.unsubscribe(); }
    if (this.dSub) { this.dSub.unsubscribe(); }
  }
}
