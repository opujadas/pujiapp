import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Contact } from './../../core/model/contact/contact.model';

import { DataService } from './../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class ContactService 
{
	currentContactChanged  = new Subject<Contact>();


  	constructor(private http: Http, private dataService: DataService) {

/*        this.dataService.getContacts()
        .subscribe(data => 
        {
            console.log('Data get contacts ? : '); 
            console.log(data);
            // this.city = data['a'][0]['city_name']; 
            // this.citynameChanged.next(this.city);
            // console.log(this.city);
        }); */
    }


    getContact(id: number)
    {
        console.log('getContact  -> On choppe le contact avec id ' + id); 
        const toto = this.dataService.loadContactDetails(id).subscribe(data => 
        {
            console.log('Data get contact : '); 
            console.log(data[0]);
            this.currentContactChanged.next(data[0]);
            console.log('currentContactChanged');
        });
        console.log(toto); 
    }

	setContact(contact: Contact)
	{
	    console.log('setContact');
	    console.log(contact);

        // this.currentContactChanged.next(contact);
        console.log('currentContactChanged2');
	}

    deleteContact(id: number)
    {
        return this.dataService.deleteContact(id);          
    }
}
