import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/common/services/orders.service';
import { Order } from 'src/app/common/interfaces';

@Component({
  selector: 'app-history-order-page',
  templateUrl: './history-order-page.component.html',
  styleUrls: ['./history-order-page.component.scss']
})
export class HistoryOrderPageComponent implements OnInit {

  array: Order[] = [];

  constructor(private orderService: OrdersService) { }

  ngOnInit() {
  }

}
