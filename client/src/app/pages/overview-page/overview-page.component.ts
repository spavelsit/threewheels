import {Component, OnDestroy, OnInit} from '@angular/core';
import {PositionsService} from "../../shared/services/positions.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
})
export class OverviewPageComponent implements OnInit, OnDestroy {

  public cost: number = null;

  constructor(private positions: PositionsService) { }

  private oSub: Subscription;

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.oSub = this.positions.fetch({} , 'product').subscribe(positions => {
      this.cost = positions.reduce((total, item) => {
        if (item.type === 'product') {
          return total += item.quantity * item.cost;
        }
      }, 0);
    });
  }

  ngOnDestroy() {
    this.oSub.unsubscribe();
  }

}
