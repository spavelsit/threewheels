import { Injectable } from '@angular/core';
import { Print } from '../intefaces';
import { VariablesService } from './variables.service';

@Injectable({ providedIn: 'root' })

export class FunctionsService {

  constructor(private array: VariablesService) { }

  onPrint({ item, type }: Print) {
    this.array.printItem = { item, type };
  }

  onReplacer(str) {
    const replace = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
      'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'];
    const search = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '\\[', '\\]',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '\\.'];

    for (let i = 0; i < replace.length; i++) {
      const reg = new RegExp(replace[i], 'mig');

      str = str.replace(reg, a => {
        return a === a.toLowerCase() ? search[i] : search[i].toUpperCase();
      });
    }
    return str;
  }

  onPrintQRCode(item: any) {
    this.array.printQRCode = item;
  }
}
