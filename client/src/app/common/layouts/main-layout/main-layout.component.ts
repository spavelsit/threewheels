import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { VariableService } from '../../services/variable.service';
import { Subscription } from 'rxjs';
import { PositionService } from '../../services/positions.service';
import { MaterialService, MaterialInstance } from '../../utils/material.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Position } from '../../interfaces';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;

  @ViewChild('modal', { static: true }) modalRef: ElementRef;
  modal: MaterialInstance;

  oSub: Subscription;
  preloader = false;
  inputSearch = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private positionService: PositionService,
    public variable: VariableService
  ) { }

  ngOnInit() {
    this.oSub = this.positionService.totalPrice().subscribe(obj => {
      this.variable.totalPrice = obj.total_price;
      this.preloader = true;
    });

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      article: new FormControl(null),
      quantity: new FormControl(1, Validators.required),
      cost: new FormControl(null, Validators.required),
      orderCost: new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onClearInputSearch() {
    this.inputSearch = '';
    this.fetchPosition();
  }

  onInputSearch(event) {
    if (window.location.pathname !== '/positions') {
      this.router.navigate(['/positions']);
    }

    if (event.explicitOriginalTarget.value.length === 0) {
      this.fetchPosition();
      return;
    }

    this.variable.preloaderPosition = false;

    this.oSub = this.positionService.find({ text: event.explicitOriginalTarget.value }).subscribe(positions => {
      if (positions.length === 0) {
        MaterialService.toast('Совпадений не найдено');
        return;
      }

      this.variable.arrayPosition = positions;
      this.variable.noMorePosition = true;
      this.variable.preloaderPosition = true;
    });
  }

  fetchPosition() {
    this.variable.preloaderPosition = false;
    this.oSub = this.positionService.getAll({ limit: 30 }, 'product').subscribe(positions => {
      this.variable.arrayPosition = positions;
      this.variable.noMorePosition = false;
      this.variable.preloaderPosition = true;
    });

  }

  onModalOpen() {
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onSubmitPosition() {
    this.form.disable();

    const position: Position = {
      name: this.form.get('name').value,
      quantity: this.form.get('quantity').value,
      article: this.form.get('article').value ? this.form.get('article').value.toUpperCase() : '',
      cost: this.form.get('cost').value,
      orderCost: this.form.get('orderCost').value,
      type: 'product'
    };

    this.oSub = this.positionService.create(position).subscribe(createdPosition => {
      if (this.variable.arrayPosition.length !== 0) {
        this.variable.arrayPosition.push(createdPosition);
        this.variable.totalPrice += createdPosition.quantity * createdPosition.cost;
      }
      this.modal.close();
      this.form.enable();
      MaterialService.toast(`Товар успешно добавлен`);
    });
  }

  onModalClose() {
    this.modal.close();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
}
