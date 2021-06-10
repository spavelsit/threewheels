import { Component, AfterViewInit } from '@angular/core';
import { VariablesService } from '../../services/variables.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html'
})
export class QrcodeComponent implements  AfterViewInit {

  constructor(public array: VariablesService) { }

  ngAfterViewInit() {
    window.print();
    setTimeout(() => { this.array.printQRCode = null; }, 100);
  }
}
