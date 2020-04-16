import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ElementService } from './../../../core/service/element.service';


/*import { TagListService } from './../../../core/service/tag-list.service';

import { TagService } from './../../../core/service/tag.service';
import { Tag } from './../../../core/model/tag/tag.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
*/

import { View } from './../../../core/model/view/view.model';
import { ViewService } from './../../../core/service/view.service';


@Component({
  selector: 'childrenview',
  templateUrl: './childrenview.component.html',
  styleUrls: ['./childrenview.component.css']
})

export class ChildrenviewComponent {

  @Input()
  parentview : View; 
  

  /*
  @Input()
  bgcolor : string = "#DDDDDD";

  @Input()
  element_id : number = 0;

  @Input()
  view_id : number = 0;

  @Input()
  tag_id : number = 0;

  @Input()
  show_delete_action : boolean = true; 

  @Output() 
  deleteTag : EventEmitter<number> = new EventEmitter<number>();
*/


  constructor()  { 
    console.log("Constructor Children view !"); 

    console.log("On insère les enfants de "); 
    console.log(this.parentview); 
  }
}