import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Position } from '../../interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { PositionService } from '../../services/position.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  type: string
  position?: Position
}

@Component({
  selector: 'app-create-or-edit-position-module',
  templateUrl: './create-or-edit-position-module.component.html',
  styleUrls: ['./create-or-edit-position-module.component.scss']
})

export class CreateOrEditPositionModuleComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<CreateOrEditPositionModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sharedService: SharedService,
    private positionService: PositionService,
    private snackBar: MatSnackBar
  ) {}

  form: FormGroup

  oSub:Subscription

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      article: new FormControl(null),
      quantity: new FormControl(1, [ Validators.required, Validators.min(0)]),
      cost: new FormControl(null, [Validators.required, Validators.min(1)]),
      cost_of_sale: new FormControl(null, [Validators.required, Validators.min(1)])
    }, {validators: this.validators.bind(this)})

    if (this.data.type === 'edit' && this.data.position) {
      this.form.patchValue({
        name: this.data.position.name,
        article: this.data.position.article,
        quantity: this.data.position.quantity,
        cost: this.data.position.cost,
        cost_of_sale: this.data.position.cost_of_sale
      })
    }
  }

  validators(g: FormGroup) {
    if (this.data.type === 'edit' && this.data.position) {
      const position = {...this.data.position}
      delete position.alias_id
      delete position.id

      if (JSON.stringify(position) === JSON.stringify(g.value)) {
        return {'mismatch': true}
      }

      return null
    }
  }

  onSubmit() {
    this.form.disable()
    if (this.data.type === 'create') return this.createPosition()
    if (this.data.type === 'edit' && this.data.position) return this.editPosition()
  }

  createPosition() {
    const position: Position = {
      ...this.form.value,
      alias_id: this.sharedService.genereteAliasId()
    }

    this.oSub = this.positionService.create(position).subscribe(position => {
      this.dialogRef.close()
      this.form.reset({quantity: 1})
      this.snackBar.open('Позиция успешно добавлена')
      this.form.enable()
      
      this.sharedService.totalPrice += position.cost * position.quantity

      if (this.positionService.table) {
        this.positionService.positions.push(position)
        this.sharedService.renderRows(this.positionService.table)
      }
    }, err => {
      this.snackBar.open(JSON.stringify(err.error))
      this.form.enable()
    })
  }

  editPosition() {
    const _position: Position = {
      id: this.data.position.id,
      name: this.form.get('name').value !== this.data.position.name ? this.form.get('name').value : undefined,
      article: this.form.get('article').value !== this.data.position.article ? this.form.get('article').value : undefined,
      quantity: this.form.get('quantity').value !== this.data.position.quantity ? this.form.get('quantity').value : undefined,
      cost: this.form.get('cost').value !== this.data.position.cost ? this.form.get('cost').value : undefined,
      cost_of_sale: this.form.get('cost_of_sale').value !== this.data.position.cost_of_sale ? this.form.get('cost_of_sale').value : undefined
    }

    this.oSub = this.positionService.edit(_position).subscribe(position => {
      const idx = this.positionService.positions.findIndex(item => item.id === position.id)

      if (this.positionService.table) {
        this.positionService.positions[idx] = position
        this.sharedService.renderRows(this.positionService.table)
      }

      this.sharedService.totalPrice -= this.data.position.cost * this.data.position.quantity
      this.sharedService.totalPrice += position.cost * position.quantity

      this.dialogRef.close()

      this.form.reset({quantity: 1})
      this.snackBar.open('Позиция успешно обновлена')

      this.form.enable()
    }, err => {
      this.snackBar.open(JSON.stringify(err.error))
      this.form.enable()
    })
  }

  deletePosition() {
    this.oSub = this.positionService.delete(this.data.position.id).subscribe(() => {
      
      const idx = this.positionService.positions.findIndex(item => item.id === this.data.position.id)

      this.positionService.positions.splice(idx, 1)
      this.form.reset({quantity: 1})

      this.sharedService.totalPrice -= this.data.position.cost * this.data.position.quantity

      this.dialogRef.close()

      this.sharedService.renderRows(this.positionService.table)
      this.snackBar.open('Позиция успешно удалена')
    })
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()

    this.form.reset({quantity: 1})
    this.data = null
    this.dialogRef = null
  }
}
