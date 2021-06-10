import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { VariablesService } from '../../services/variables.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialService } from '../../classes/material.service';
import { Subscription } from 'rxjs';
import { PositionsService } from '../../services/positions.service';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html'
})
export class SiteLayoutComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  public success = false;
  public create = false;
  public newPosition: any = null;
  public nSub: Subscription;

  public type = null;


  constructor(
    private auth: AuthService,
    private router: Router,
    private positionsService: PositionsService,
    public array: VariablesService,
    private functions: FunctionsService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      article: new FormControl(null),
      quantity: new FormControl(1, Validators.required),
      cost: new FormControl(null),
      type: new FormControl('product'),
      orderCost: new FormControl(null)
    });
    window.onkeydown = e => {
      if (this.create) {
        const enter = 13;
        // tslint:disable-next-line: deprecation
        if (e.keyCode === enter && !this.form.disabled) {
          if (this.success) { this.printQrCode(); return; }

          this.createPosition();
        }
      }
    };
  }

  onSubmit() {
    this.create = true;
  }

  onPrev() {
    this.create = false;
  }

  createPosition() {
    this.form.disable();
    const message = this.type === 'product' ? 'Товар успешно добавлен' : 'Услуга успешно добавлена';

    const product = {
      name:  this.form.get('name').value,
      quantity:  this.form.get('quantity').value,
      article: this.form.get('article').value ? this.form.get('article').value.toUpperCase() : '',
      cost: this.form.get('cost').value,
      orderCost: this.form.get('orderCost').value,
      type: this.form.get('type').value
    };

    this.nSub = this.positionsService.create(product).subscribe(item => {
      if (this.array.products.length !== 0 && item.type === 'product') {
        item.selQuantity = 1;
        item.genQuantity = item.quantity;
        this.array.products.push(item);
      } else if (this.array.colors.length !== 0 && item.type === 'colors') {
        item.selQuantity = 1;
        item.genQuantity = item.quantity;
        this.array.colors.push(item);
      }

      this.newPosition = item;
      MaterialService.toast(message);
    },
    error => { MaterialService.toast(error.error.message); },
    () => {
      this.form.enable();
      this.success = true;
    }
    );

  }

  printQrCode() {
    this.functions.onPrintQRCode(this.newPosition);
    this.onClose();
  }

  ngOnDestroy() {
    if (this.nSub) {
      this.nSub.unsubscribe();
    }
  }

  onClose() {
    this.onToggle(this.type);
    this.form.reset({quantity: 1, type: 'product'});
    this.newPosition = null;
    this.create = false;
    this.success = false;
    MaterialService.toast('Форма успешно очищена');
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onToggle(type: string) {
    const element = document.querySelector('.header-nav__toggle');

    if (this.type === type ) {
      element.classList.toggle('active');
    } else {
      element.classList.add('active');
    }

    this.type = type;
  }
}
