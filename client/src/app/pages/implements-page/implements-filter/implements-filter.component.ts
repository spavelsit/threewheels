import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {MaterialDatepicker, MaterialService} from "../../../shared/classes/material.service";

@Component({
  selector: 'app-implements-filter',
  templateUrl: './implements-filter.component.html'
})
export class ImplementsFilterComponent implements AfterViewInit {

  constructor() { }

  @Output() onFilter = new EventEmitter<any>();

  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;

  start: MaterialDatepicker;
  end: MaterialDatepicker;

  isValid = true;

  validate() {
    if (!this.start.date  || !this.end.date) {
      this.isValid = true;
      return;
    }
    this.isValid = this.start.date < this.end.date;
  }

  submitFilter() {
    const filter: any = {};

    if (this.start.date) {
      filter.start = this.start.date;
    }
    if (this.end.date) {
      filter.end = this.end.date;
    }
    this.onFilter.emit(filter);
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }
}
