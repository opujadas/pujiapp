// Core components
import { Component, Input, OnInit, OnDestroy, ViewChild, Inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Custom components
import { DialogAddChildView } from '../dialogs/dialog-add-child-view.component';


@Component({
  selector: 'treeviewmenu',
  templateUrl: './treeviewmenu.component.html',
  styleUrls: ['./treeviewmenu.component.css']
})

export class TreeviewmenuComponent {

  /**********************************************************************************************************
   Custom variables & attributes
  ***********************************************************************************************************/

  @Input()
  node: any;

  /**********************************************************************************************************
   Constructor 
  ***********************************************************************************************************/

  constructor(public dialog: MatDialog) { }

  /**********************************************************************************************************
   Fonction addChildView(view) 
      => fonction qui permet d'ouvrir une boite dialogue pour créer une sous-vue
    
    /!\ Fonction semble redondante avec la même fonction dans view-layout.components.ts
  ***********************************************************************************************************/

  addChildView(view : View) : void {

    let dialogRef = this.dialog.open(DialogAddChildView, {
      width: '80%',
      data: view
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
     }); 
  }
}