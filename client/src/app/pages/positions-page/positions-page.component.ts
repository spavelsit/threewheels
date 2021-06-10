import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PositionService } from 'src/app/common/services/positions.service';
import { VariableService } from 'src/app/common/services/variable.service';
import { Subscription } from 'rxjs';

import { faQrcode, faEdit, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/common/utils/material.service';
import { Position } from 'src/app/common/interfaces';
import { OrdersService } from 'src/app/common/services/orders.service';

const step = 30;

@Component({
  selector: 'app-positions-page',
  templateUrl: './positions-page.component.html',
  styleUrls: ['./positions-page.component.scss']
})
export class PositionsPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private oSub: Subscription;
  form: FormGroup;

  @ViewChild('modal', { static: true }) modalRef: ElementRef;
  modal: MaterialInstance;

  faQrcode = faQrcode;
  faEdit = faEdit;
  faCartPlus = faCartPlus;

  loaderMore = true;

  editPositionID = '';

  private limit = step;
  private offset = 0;

  constructor(
    private positionService: PositionService,
    public variable: VariableService,
    public orderService: OrdersService
  ) { }

  ngOnInit() {
    this.fetch();
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      article: new FormControl(null),
      quantity: new FormControl(1, Validators.required),
      cost: new FormControl(null, Validators.required),
      orderCost: new FormControl(null, Validators.required)
    });
  }

  private fetch() {

    const params = {
      limit: this.limit,
      offset: this.offset
    };

    this.oSub = this.positionService.getAll(params, 'product').subscribe(positions => {
      this.variable.arrayPosition = this.variable.arrayPosition.concat(positions);
      this.variable.preloaderPosition = true;
      this.loaderMore = true;

      this.offset += step;
      this.variable.noMorePosition = positions.length < step;
    });

  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onModalOpen(position?: Position) {
    this.editPositionID = position._id;
    this.form.patchValue({
      name: position.name,
      quantity: position.quantity,
      article: position.article ? position.article : '',
      cost: position.cost,
      orderCost: position.orderCost
    });

    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onModalClose() {
    this.modal.close();
  }

  onSubmitPosition() {

    const editPosition: Position = {
      _id: this.editPositionID,
      name: this.form.value.name,
      article: this.form.value.article ? this.form.value.article.toUpperCase() : '',
      quantity: this.form.value.quantity,
      cost: this.form.value.cost,
      orderCost: +this.form.value.orderCost.toFixed(0)
    };

    const candidate = this.variable.arrayPosition.find(el => el._id === this.editPositionID);

    if (
      candidate.name === editPosition.name && candidate.article === editPosition.article &&
      candidate.quantity === editPosition.quantity && candidate.cost === editPosition.cost &&
      candidate.orderCost === editPosition.orderCost
    ) { this.modal.close(); return; }


    const password = prompt('Введите пароль для изменения товара:');

    if (password !== '1970') { return; }

    this.form.disable();

    this.oSub = this.positionService.update(editPosition).subscribe(position => {
      const idx = this.variable.arrayPosition.findIndex(el => el._id === this.editPositionID);

      if (candidate.quantity !== position.quantity || candidate.cost !== position.cost) {
        this.variable.totalPrice -= candidate.quantity * candidate.cost;
        this.variable.totalPrice += position.quantity * position.cost;
      }

      this.variable.arrayPosition[idx] = position;

      MaterialService.toast('Товар обнавлен');
    },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable();
      },
      () => {
        this.modal.close();
        this.form.enable();
      }
    );

  }

  onDeletePosition() {
    const password = prompt('Введите пароль для удаления товара:');
    if (password !== '1970') { return; }

    this.oSub = this.positionService.delete(this.editPositionID).subscribe(() => {
      const idx = this.variable.arrayPosition.findIndex(el => el._id === this.editPositionID);

      this.variable.totalPrice -= this.variable.arrayPosition[idx].quantity * this.variable.arrayPosition[idx].cost;

      this.variable.arrayPosition.splice(idx, 1);

      MaterialService.toast('Товар успешно удален');

      this.modal.close();
    });
  }

  public loadMore() {
    this.loaderMore = false;
    this.fetch();
  }

  ngOnDestroy() {
    this.variable.arrayPosition = [];
    this.variable.preloaderPosition = false;
    this.oSub.unsubscribe();
  }
}
