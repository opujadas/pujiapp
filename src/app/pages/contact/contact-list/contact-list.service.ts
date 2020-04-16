import { Contact } from './../../../core/model/contact/contact.model';
import { Subject } from 'rxjs/Subject';
import { DataService } from '../../../core/data/data.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable() // <<<=== required if the constructor has parameters 


export class ContactListService 
{
  contactChanged  = new Subject<string>();
  private contacts: Contact[]; 
  //private http: Http, private dataService: DataService
  
  constructor(private http: Http, private dataService: DataService) {
    console.log('A la constructor, on choppe la liste des contacts'); 
    
   /*    this.dataService.getData()
        .subscribe(data => 
        {
            console.log('CONTACT ? : '); 
            console.log(data);
        });
        */ 
  }


getContacts()
{
    console.log('Contacts list service -> On choppe la liste des contacts'); 
    return this.dataService.getContacts(); 
}

}