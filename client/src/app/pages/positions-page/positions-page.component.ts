import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { VariablesService } from 'src/app/shared/services/variables.service';

@Component({
  selector: 'app-positions-page',
  templateUrl: './positions-page.component.html'
})
export class PositionsPageComponent implements OnInit, OnDestroy {

  pSub: Subscription;

  public type: string = null;

  constructor(private route: ActivatedRoute, public array: VariablesService) { }

  ngOnInit() {
    this.pSub = this.route.queryParams.subscribe((params: Params) => {
      this.type = params.type;
    });
  }

  ngOnDestroy() {
    if (this.pSub) { this.pSub.unsubscribe(); }
  }
}
