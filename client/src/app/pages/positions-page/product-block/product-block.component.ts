import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { VariablesService } from 'src/app/shared/services/variables.service';
import { ActivatedRoute, Params } from '@angular/router';

const STEP = 20;

@Component({
  selector: 'app-product-block',
  templateUrl: './product-block.component.html'
})
export class ProductBlockComponent implements OnInit, AfterViewInit, OnDestroy {

  private pSub: Subscription;
  private limit = STEP;
  private offset = 0;

  public type: string = null;
  public reloading = false;
  public moreOrders = false;

  constructor(
    private positionsService: PositionsService,
    private route: ActivatedRoute,
    public array: VariablesService
  ) { }

  ngOnInit() {
    this.pSub = this.route.queryParams.subscribe((params: Params) => {
      this.type = params.type;
    });
    this.fetch(this.type);
    this.reloading = true;
  }

  ngAfterViewInit() {
    this.loadMore();
  }

  private fetch(type: string) {
    const params = {
      limit: this.limit,
      offset: this.offset
    };
    this.pSub = this.positionsService.fetch(params, type).subscribe(product => {

      this.array.products = this.array.products.concat(product);
      this.reloading = false;
      this.moreOrders = false;

      this.array.noMoreOrders = product.length < STEP;

      return product.map(el => {
        const candidate = this.array.cart.find(item => item.itemID === el._id);

        el.genQuantity = el.quantity;
        el.selQuantity = 1;

        if (candidate) { el.quantity -= candidate.quantity; }
      });
    });
  }

  private loadMore() {
    document.querySelector('.wrapper-page').addEventListener('scroll', () => {
      const scrollTop = document.querySelector('.wrapper-page').scrollTop;
      const visibledHeight = document.querySelector('.wrapper-page').clientHeight;

      const elementHeight = document.querySelector('.wrapper-page').scrollHeight;


      if (elementHeight !== scrollTop + visibledHeight
          && this.moreOrders !== true
          || this.array.noMoreOrders === true
      ) { return; }

      this.moreOrders = true;
      this.offset += STEP;
      this.fetch(this.type);

    });
  }

  applyFilter() {
    this.fetch(this.type);
    this.array.noMoreOrders = false;
  }

  ngOnDestroy() {
    if (this.pSub) { this.pSub.unsubscribe(); }
    if (this.array.products.length !== 0) { this.array.products = []; }
  }
}
