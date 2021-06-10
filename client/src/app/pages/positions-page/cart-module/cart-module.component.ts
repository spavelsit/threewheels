import { Component, OnInit, OnDestroy } from '@angular/core';
import { VariablesService } from 'src/app/shared/services/variables.service';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { OrderPosition, Order } from 'src/app/shared/intefaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalcService } from 'src/app/shared/services/calc.service';
import { AsYouType } from 'libphonenumber-js';
import { Subscription } from 'rxjs';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-cart-module',
  templateUrl: './cart-module.component.html'
})
export class CartModuleComponent implements OnInit, OnDestroy {

  constructor(
    public array: VariablesService,
    public ordersService: OrdersService,
    public positionsService: PositionsService,
    public calc: CalcService,
    public functions: FunctionsService
  ) { }

  private cSub: Subscription;
  private pSub: Subscription;
  private qrSub: Subscription;

  public order: Order;

  public qrcode: string = null;

  public form: FormGroup;

  public module = 'basket';
  public error: any = {};

  public success = false;
  public loading = false;

  ngOnInit() {

    this.form = new FormGroup({
      percent: new FormControl(null),
      rub: new FormControl(null),
      mechanic: new FormControl('null'),
      mechanicPercent: new FormControl(null),
    });

    this.autoCloseCart();
  }

  ngOnDestroy() {
    if (this.cSub) { this.cSub.unsubscribe(); }
    if (this.pSub) { this.pSub.unsubscribe(); }
    if (this.qrSub) { this.qrSub.unsubscribe(); }
  }

  setQrCode() {
    if (this.qrcode.length === 24) {
      this.selModule('basket');

      const qrcode = this.functions.onReplacer(this.qrcode);

      this.qrSub = this.positionsService.qrcode(qrcode).subscribe(position => {

        const candidate = this.array.cart.find(item => item.itemID === position._id);

        if (candidate && candidate.quantity >= position.quantity) {
          MaterialService.toast('Данный товар отсутствует на складе');
          return;
        }

        if (position.quantity <= 0) {
          MaterialService.toast('Данный товар отсутствует на складе');
          return;
        }

        position.selQuantity = 1;
        position.genQuantity = position.quantity;

        this.ordersService.addItemCart(position);
      });

      this.qrcode = null;
    }
  }

  onPrint() {
    this.functions.onPrint({ item: this.order, type: 'new' });
    this.onClose('new');
    this.order = null;
  }

  onSubmitCreate() {
    this.array.cart.map(el => { delete el._id; return; });

    this.loading = true;

    const order: Order = {
      mechanic: this.form.get('mechanic').value !== 'null' ? this.form.get('mechanic').value : null,
      percent: this.form.get('mechanic').value !== 'null' ? this.form.get('mechanicPercent').value : null,
      sale: this.form.get('percent').value,
      list: this.array.cart
    };

    this.cSub = this.ordersService.create(order).subscribe(newOrder => {
      this.order = newOrder;
      MaterialService.toast(`Заказ №${newOrder.order} был добавлен`);
      order.list.map(item => {
        this.positionsService.update({ _id: item.itemID, quantity: item.amout - item.quantity }).subscribe();
      });

    },
      err => MaterialService.toast(err.error.message),
      () => {
        this.loading = false;
        this.success = true;
      }
    );
  }

  onClose(type = 'old') {
    this.form.reset();
    this.selModule('basket');
    this.order = null;
    this.success = false;
    this.toggleCart();

    if (type === 'new') { this.array.cart = []; return; }

    this.ordersService.clearCart();
    MaterialService.toast('Корзина успешно очищена');
  }

  changePrice(type: string) {
    const price = {
      rub: this.form.get('rub'),
      percent: this.form.get('percent')
    };

    if (price.rub.value > this.calc.cartCost() / 2) { price.rub.setValue(this.calc.cartCost() / 2); }
    if (price.percent.value > 50) { price.percent.setValue(50); }

    if (type === 'percent') {
      this.form.get('rub').setValue(this.calc.cartSale({ rub: price.rub.value, percent: price.percent.value }).rub);
    }

    if (type === 'rub') {
      this.form.get('percent').setValue(this.calc.cartSale({ rub: price.rub.value, percent: price.percent.value }).percent);
    }
  }

  removeItem(item: OrderPosition) {
    this.ordersService.removeItemCart(item);
    if (this.array.cart.length === 0) {
      this.form.reset();
    }
  }

  toggleCart() {
    document.querySelector('.cart-module').classList.toggle('active');
  }

  private autoCloseCart() {
    const element = document.querySelector('.cart-module');
    document.onmouseup = event => {
      const target = event.target;
      if (element.classList.contains('active')) {
        if (document.querySelector('.cart-module') && !document.querySelector('.cart-module').contains(target as Node)) {
          element.classList.remove('active');
        }
      }

      if (document.querySelector('.cart-total__qrcode-block')
        && !document.querySelector('.cart-total__qrcode-block').contains(target as Node)) {
        this.qrcode = null;
        document.querySelector('.cart-total__qrcode').classList.remove('active');
      }

    };
  }

  selModule(module: string) {
    this.module = module;
  }

  nextModule() {
    if (this.module === 'basket' && this.array.cart.length !== 0) {
      this.module = 'registration';
    } else if ( this.module === 'registration') {
      this.module = 'result';
    }
  }
}
