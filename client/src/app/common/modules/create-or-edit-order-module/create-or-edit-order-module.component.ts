import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Order, PositionToOrder, Companion } from '../../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { CompanionService } from '../../services/companion.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PositionService } from '../../services/position.service';

interface DialogData {
  type: string
  order?: Order
}

@Component({
  selector: 'app-create-or-edit-order-module',
  templateUrl: './create-or-edit-order-module.component.html',
  styleUrls: ['./create-or-edit-order-module.component.scss']
})

export class CreateOrEditOrderModuleComponent implements OnInit, OnDestroy{
  constructor(
    public dialogRef: MatDialogRef<CreateOrEditOrderModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public orderService: OrderService,
    private companionService: CompanionService,
    private positionService: PositionService,
    public sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {}

  @ViewChild('table') table:MatTable<Element>

  companions: Companion[] = []
  oSub: Subscription

  form: FormGroup

  ngOnInit() {
    this.oSub = this.companionService.getAll().subscribe(companion => {
      this.companions = companion
    })

    this.form = new FormGroup({
      full_name: new FormControl(null),
      phone: new FormControl(null, [Validators.minLength(15), Validators.maxLength(15)]),
      delivery_method: new FormControl('service'),
      sale: new FormControl('0'),
      cost_of_work: new FormControl(null, Validators.min(0)),
      companion: new FormControl('0'),
      address_delivery: new FormControl(null)
    }, {validators: this.validators})
    
    if (localStorage.getItem('order')) {
      const order = JSON.parse(localStorage.getItem('order'))

      this.form.patchValue({
        full_name: order.full_name,
        phone: order.phone,
        delivery_method: order.delivery_method,
        sale: order.sale,
        cost_of_work: order.cost_of_work ? +order.cost_of_work : null,
        companion: order.companion,
        address_delivery: order.address_delivery
      })
    }
  }

  validators(g: FormGroup) {
    if (g.get('delivery_method').value === 'delivery') {
      return g.get('address_delivery').value  ? null : {'mismatch': true}
    }
    
    if (g.get('delivery_method').value === 'service' && g.get('cost_of_work').value) {
      return g.get('companion').value > 0 ? null : {'mismatch': true}
    }
  }

  onSubmit() {
    this.form.disable()
    if (this.data.type === 'create') this.createOrder()
  }

  createOrder() {
    const order: Order = {
      detail: {
        full_name: this.form.get('full_name').value,
        phone: this.form.get('phone').value,
        address_delivery: this.form.get('delivery_method').value === 'delivery' ? this.form.get('address_delivery').value : undefined,
        sale: +this.form.get('sale').value
      },
      positions: this.orderService.positionToOrder.map(el => {
        if (+el.companion <= 0 ) el.companion = undefined
        else if (+el.companion > 0) +el.companion
        return el
      })
    }

    if (
      this.form.get('delivery_method').value === 'service' &&
      +this.form.get('cost_of_work').value > 0 &&
      +this.form.get('companion').value > 0
    ) {
      order.companion = {
        companion: +this.form.get('companion').value,
        cost_of_work: +this.form.get('cost_of_work').value
      }
    }
    
    this.oSub = this.orderService.create(order).subscribe(callback => {
      this.dialogRef.close()
      this.snackBar.open('Заказ успешно создан')
      
      this.form.enable()
      this.sharedService.totalPrice -= this.orderService.positionToOrder.reduce((total, item) => {
        return total += item.cost * item.quantity
      }, 0)

      localStorage.removeItem('order')
      localStorage.removeItem('positionToOrder')

      this.orderService.positionToOrder = []

      this.form.reset({delivery_method: 'service', sale: '0', companion: '0'})

    },err => {
      this.form.enable()
      this.snackBar.open(JSON.stringify(err.error))
    })
  }

  deletePosition(position: PositionToOrder) {
    this.orderService.deletecCartPositionToOrder(position)
    this.table.renderRows()
  }

  inputForm() {
    const order = {
      full_name: this.form.get('full_name').value,
      phone: this.form.get('phone').value,
      delivery_method: this.form.get('delivery_method').value,
      sale: this.form.get('sale').value,
      companion: this.form.get('companion').value,
      cost_of_work: this.form.get('cost_of_work').value,
      address_delivery: this.form.get('address_delivery').value
    }

    localStorage.setItem('order', JSON.stringify(order))
  }

  qrcodeSearch($event) {
    if ($event.target.value.length > 24) $event.target.value = ''
    if ($event.target.value.length === 24) {
      const candidate = this.orderService.positionToOrder.find(position => position.alias_id === $event.target.value)
      
      if (candidate) {
        if (candidate.quantity >= candidate.amount) {
          candidate.quantity = candidate.amount
          this.snackBar.open('Товар отсутсвует на складе')
        } else {
          candidate.quantity++
          this.snackBar.open('Товар добавлен в корзину')
        }
        $event.target.value = ''
        return
      }

      this.oSub = this.positionService.getAll({qrcode: $event.target.value}).subscribe(callback => {
        if (callback.results.length === 0) {
          this.snackBar.open('Товар не найден')
          $event.target.value = ''
          return
        }
        this.orderService.addCartPositionToOrder(callback.results[0])
        this.table.renderRows()
      }, err => {
        this.snackBar.open(JSON.stringify(err.error))
      })

      $event.target.value = ''
      this.snackBar.open('Товар добавлен в корзину')
    }
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()

    this.companions = []
  }
}
