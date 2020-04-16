import { Tag } from './../model/tag/tag.model';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable() // <<<=== required if the constructor has parameters 


export class TagListService 
{
  tagChanged  = new Subject<string>();
  private tags: Tag[]; 
  //private http: Http, private dataService: DataService
  
  constructor(private http: Http, private dataService: DataService) {
    console.log('A la constructor, on choppe la liste des tags'); 
    
   /*    this.dataService.getData()
        .subscribe(data => 
        {
            console.log('CONTACT ? : '); 
            console.log(data);
        });
        */ 
  }


getTags() {
    console.log('Tags list service -> On choppe la liste des tags'); 
    return this.dataService.getTags(); 
}

}