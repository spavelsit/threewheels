import { ElementRef } from '@angular/core';

declare var M;

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message});
  }
  static initAutocomplete(ref: ElementRef, options: any, limit: number = 5): MaterialAutocomplete {
    return M.Autocomplete.init(ref.nativeElement, {
      data: options,
      limit
    });
  }

  static initDatepicker(ref: ElementRef, onClose: () => void): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      i18n: {
        cancel: 'Отмена',
        clear: 'Очистить',
        done: 'Применить',
        months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
        monthsShort: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
        weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
        weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        weekdaysAbbrev: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      },
      onClose
    });
  }

}

export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date;
}

export interface MaterialAutocomplete extends MaterialInstance {
  el?: {
    value?: string;
  };
  selectOption?(): void;
}
