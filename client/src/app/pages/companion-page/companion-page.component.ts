import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Companion } from 'src/app/common/interfaces';
import { CreateOrEditCompanionModuleComponent } from 'src/app/common/modules/create-or-edit-companion-module/create-or-edit-companion-module.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanionService } from 'src/app/common/services/companion.service';
import { Subscription } from 'rxjs';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-companion-page',
  templateUrl: './companion-page.component.html',
  styleUrls: ['./companion-page.component.scss']
})
export class CompanionPageComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public companionService: CompanionService
  ) { }
  
  oSub: Subscription

  @ViewChild('matTable') table: MatTable<Element>

  ngOnInit(): void {
    this.companionService.companions = []
    this.oSub = this.companionService.getAll().subscribe(companion => {
      this.companionService.companions = companion

      this.companionService.preloader = false

      this.companionService.table = this.table
    })
  }

  editCompanionModalOpen(companion: Companion) {
    this.dialog.open(CreateOrEditCompanionModuleComponent, {
      width: '780px',
      data: { type: 'edit', companion}
    });
  }

  ngOnDestroy() {
    this.companionService.preloader = true
    if (this.oSub) this.oSub.unsubscribe()
    this.companionService.companions = []
    this.companionService.table = null
  }
}
