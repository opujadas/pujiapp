import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Contact } from './../../core/model/contact/contact.model';

import { DataService } from '../../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class ListContactService 
{
	currentContactChanged  = new Subject<Contact>();
    subscription : Subscription; 

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

    getContactLists()
    {
        console.log('Contacts list service -> On choppe toutes les listes des contacts'); 
        return this.dataService.getContactLists(); 
    }

    getListcontact(id: number)
    {
        console.log('Contacts list service -> On choppe les infos de la liste de contact' + id); 
        return this.dataService.getListcontact(id);         
    }    

    getContactsInContactlist(id: number)
    {
        console.log('Contacts list service -> On choppe la liste des contacts de la liste ' + id ); 
        return this.dataService.getContactsInContactlist(id); 
    }

    getContactsNotInContactlist(id: number)
    {
        console.log('Contacts list service -> On choppe la liste des contacts'); 
        return this.dataService.getContactsNotInContactlist(id); 
    }    

    addContactsInContactlist(contact_id, list_id)
    {
        console.log('Contacts list service -> addContactsInContactlist pour ' + contact_id + ' ' + list_id); 
        return this.dataService.addContactsInContactlist(contact_id, list_id); 

    }

    deleteContactsFromContactlist(contact_id, list_id)
    {
        console.log('Contacts list service -> deleteContactsFromContactlist pour ' + contact_id + ' ' + list_id); 
        return this.dataService.deleteContactsFromContactlist(contact_id, list_id); 

    }

    deleteContactList(list_id)
    {
        console.log('Contacts list service -> deleteContactList pour ' + list_id); 
        return this.dataService.deleteContactList(list_id); 
    }


/*
    getContactsInContactlist(id: number)
    {
        console.log('getContact  -> On choppe les contacts dans la liste : ' + id); 
        this.dataService.getContactsInContactlist(id).subscribe(data => 
        {
            console.log('Data get contact : '); 
            console.log(data);
            this.currentContactChanged.next(data);
            console.log('currentContactChanged');
        });
//        console.log(toto); 
    }*/


    getContact(id: number)
    {
        console.log('getContact  -> On choppe le contact avec id ' + id); 
        this.subscription = this.dataService.loadContactDetails(id).subscribe(data => 
        {
            console.log('Data get contact : '); 
            console.log(data[0]);
            this.currentContactChanged.next(data[0]);
            console.log('currentContactChanged');
        });

        this.subscription.unsubscribe(); 
    }

	setContact(contact: Contact)
	{
	    console.log('setContact');
	    console.log(contact);

        // this.currentContactChanged.next(contact);
        console.log('currentContactChanged2');
	}


}
