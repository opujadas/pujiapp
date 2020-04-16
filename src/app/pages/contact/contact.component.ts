import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { ContactListService } from './contact-list/contact-list.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';

import { Contact } from './../../core/model/contact/contact.model';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  private contacts: Contact[]; 
  private subscription: Subscription;


  constructor(private slimLoadingBarService: SlimLoadingBarService, 
              private dataService: DataService, 
              private contactListService: ContactListService,
              private router: Router,
              private route: ActivatedRoute) 
  { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    	console.log('On est dans le contact component, on va chopper la liste des contacts'); 
    	// this.dataStorageService.getRecipes();
  }



  ngOnInit() {

  	// initialement on charge la liste des contacts
    this.subscription = this.contactListService.getContacts()
      .subscribe(data => 
      {
          console.log('contacts : '); 
          console.log(data);
          
          this.contacts = Object.values(data); 
          console.log('***********');
          console.log(this.contacts); 
          console.log('***********');
      });
      
      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();

  }


  onNewContact() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }  
}
