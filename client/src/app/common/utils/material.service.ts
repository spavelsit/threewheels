import { ElementRef } from '@angular/core';

declare const M: any;

export class MaterialService {
  static toast(message: string) {
    M.toast({html: message, classes: 'toast__position'});
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef) {
    return M.Modal.init(ref.nativeElement);
  }

}

export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}
