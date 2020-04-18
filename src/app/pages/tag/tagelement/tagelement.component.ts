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

@Component({
  selector: 'tagelement',
  templateUrl: './tagelement.component.html',
  styleUrls: ['./tagelement.component.css']
})

export class TagelementComponent
{
  @Input()
  label : string = "defaut"; 

  @Input()
  bgcolor : string = "#DDDDDD";

  @Input()
  element_id : string = 0;

  @Input()
  view_id : string = 0;

  @Input()
  tag_id : string = 0;

  @Input()
  show_delete_action : boolean = true; 

  @Output() 
  deleteTag : EventEmitter<string> = new EventEmitter<string>();



  constructor(private _elementService : ElementService)  { 
    console.log("String du tag : " + this.label); 
  }

  deleteTagFromElement(tag_id, element_id){    
    this.deleteTag.emit(tag_id);
  }


  ngOnDestroy() {
  }
}