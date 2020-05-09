import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ElementService } from './../../../core/service/element.service';

@Component({
  selector: 'tagelement',
  templateUrl: './tagelement.component.html',
  styleUrls: ['./tagelement.component.css']
})

export class TagelementComponent {

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
    // console.log("String du tag : " + this.label); 
  }


  deleteTagFromElement(tag_id, element_id){    
    this.deleteTag.emit(tag_id);
  }


  ngOnDestroy() {
  }
}