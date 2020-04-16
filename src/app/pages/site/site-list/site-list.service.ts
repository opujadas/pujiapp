import { Site } from './../../../core/model/site/site.model';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../core/data/data.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable() // <<<=== required if the constructor has parameters 


export class SiteListService 
{
  siteChanged  = new Subject<string>();
  private sites: Site[]; 
  //private http: Http, private dataService: DataService
  
  constructor(private http: Http, private dataService: DataService) {
    console.log('A la constructor, on choppe la liste des sites'); 
    
   /*    this.dataService.getData()
        .subscribe(data => 
        {
            console.log('CONTACT ? : '); 
            console.log(data);
        });
        */ 
  }


  getSites()
  {
      console.log('Contacts list service -> On choppe la liste des sites'); 
      return this.dataService.getSites(); 
  }

}