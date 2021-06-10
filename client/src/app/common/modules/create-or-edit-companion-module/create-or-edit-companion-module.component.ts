import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Companion } from '../../interfaces';
import { CompanionService } from '../../services/companion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { SharedService } from '../../services/shared.service';

interface DialogData {
  type: string
  companion?: Companion
}

@Component({
  selector: 'app-create-or-edit-companion-module',
  templateUrl: './create-or-edit-companion-module.component.html',
  styleUrls: ['./create-or-edit-companion-module.component.scss']
})
export class CreateOrEditCompanionModuleComponent implements OnInit, OnDestroy{

  constructor(
    public dialogRef: MatDialogRef<CreateOrEditCompanionModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private companionService: CompanionService,
    private sharedService: SharedService,
    private snackBar: MatSnackBar
  ) {}

  form: FormGroup
  oSub: Subscription

  ngOnInit() {
    this.form = new FormGroup({
      full_name: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      percent: new FormControl(null, [ Validators.required, Validators.min(0)]),
    }, {validators: this.validators.bind(this)})

    if (this.data.type === 'edit' && this.data.companion) {
      this.form.patchValue({
        full_name: this.data.companion.full_name,
        phone: this.data.companion.phone,
        percent: this.data.companion.percent
      })
    }
  }

  validators(g: FormGroup) {
    if (this.data.type === 'edit' && this.data.companion) {
      const companion = {...this.data.companion}
      delete companion.id

      if (JSON.stringify(companion) === JSON.stringify(g.value)) {
        return {'mismatch': true}
      }

      return null
    }
  }

  onSubmit() 
  {this.form.disable()
    if (this.data.type === 'create') return this.createCompanion()
    if (this.data.type === 'edit' && this.data.companion) return this.editCompanion()
  }

  createCompanion() {
    this.oSub = this.companionService.create(this.form.value).subscribe(companion => {
      this.dialogRef.close()
      this.form.reset()
      this.snackBar.open('Сотрудник успешно добавлен')
      this.form.enable()

      if (this.companionService.table) {
        this.companionService.companions.push(companion)
        this.sharedService.renderRows(this.companionService.table)
      }
    }, err => {
      this.snackBar.open(JSON.stringify(err.error))
      this.form.enable()
    })
  }

  editCompanion() {
    const _companion: Companion = {
      id: this.data.companion.id,
      full_name: this.form.get('full_name').value !== this.data.companion.full_name ? this.form.get('full_name').value : undefined,
      phone: this.form.get('phone').value !== this.data.companion.phone ? this.form.get('phone').value : undefined,
      percent: this.form.get('percent').value !== this.data.companion.percent ? this.form.get('percent').value : undefined
    }

    this.oSub = this.companionService.edit(_companion).subscribe(companion => {
      const idx = this.companionService.companions.findIndex(item => item.id === companion.id)

      if (this.companionService.table) {
        this.companionService.companions[idx] = companion
        this.sharedService.renderRows(this.companionService.table)
      }

      this.dialogRef.close()

      this.form.reset()
      this.snackBar.open('Информация о сотрутднике успешно обновлена')
    }, err => {
      this.snackBar.open(JSON.stringify(err.error))
      this.form.enable()
    })
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()

    this.form.reset()
    this.data = null
    this.dialogRef = null
  }
}
