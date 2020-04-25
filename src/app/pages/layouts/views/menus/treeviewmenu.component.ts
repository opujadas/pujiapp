// import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, OnDestroy, ViewChild, Inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// import { ElementService } from './../../../core/service/element.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogAddChildView } from '../dialogs/dialog-add-child-view.component';

/*import { TagListService } from './../../../core/service/tag-list.service';

import { TagService } from './../../../core/service/tag.service';
import { Tag } from './../../../core/model/tag/tag.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
*/

@Component({
  selector: 'treeviewmenu',
  templateUrl: './treeviewmenu.component.html',
  styleUrls: ['./treeviewmenu.component.css']
})

export class TreeviewmenuComponent {
  
  /*@Input()
  label : string = "defaut"; 

  @Input()
  bgcolor : string = "#DDDDDD";
*/
  @Input()
  node: any;
  // node_id: string;

  
/*  @Output() 
  deleteTag : EventEmitter<string> = new EventEmitter<string>();
*/


  constructor(
    public dialog: MatDialog)  {

    /* console.log("String du tag : " + this.label); */
    console.log('treeviewmenu'); 
    // console.log(this.node); 
    // console.log(this.node._id); 
  }

/*  deleteTagFromElement(tag_id, element_id){    
    this.deleteTag.emit(tag_id);
  }
*/
  addChildView(view : View) : void {

    console.log('On ouvre une fenetre dialogue pour créer une sous-vue'); 
    console.log(view); 
    let dialogRef = this.dialog.open(DialogAddChildView, {
      width: '80%',
      data: view
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
     }); 
  }
}