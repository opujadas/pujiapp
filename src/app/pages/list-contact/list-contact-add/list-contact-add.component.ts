import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Contact } from './../../../core/model/contact/contact.model';
import { ContactListService } from '../../contact/contact-list/contact-list.service';
import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import {MatTableDataSource, MatSort, MatGridListModule} from '@angular/material';

@Component({
  selector: 'app-list-contact-add',
  templateUrl: './list-contact-add.component.html',
  styleUrls: ['./list-contact-add.component.css']
})


export class ListContactAddComponent implements OnInit {

  addContactListForm: FormGroup; 

  private nom : string; //  = 'Lille'; 

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(    private slimLoadingBarService: SlimLoadingBarService, 
                  public toastr: ToastsManager, 
                  vcr: ViewContainerRef, 
                  private router: Router, 
                  private dataService: DataService,
                  private contactListService: ContactListService) 
  {

      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

  }

  ngOnInit() 
  {
    this.toastr.success('ADD CONTACT LIST !!', 'Success!');
    
    this.addContactListForm = new FormGroup(
    {
      'nom': new FormControl(null, Validators.required), 
    });

      // On charge les différents roles pour les contacts 
      /*
      this.contactListService.getContacts()
        .subscribe(
          data => 
          {
            console.log(data); 
            this.contacts = data; 
           //this.dataSource = new MatTableDataSource(data);
             // On toaste
              this.toastr.success('Les users sont chargés !', 'Success!');

          }
      );
        */
          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  
  }


  onSubmit()
  {
      // Démarrage de la barre de chargement 
     this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.addContactListForm); 
    console.log('Contact saisi : ' + this.addContactListForm.value.nom);
  
    return this.dataService.addContactList(this.addContactListForm.value.nom)
        .subscribe(
          data => 
          {
            if (data[0]['id'])
            {
                console.log(data[0]['id']); 
                // On toaste
                this.toastr.success('Le contact a bien été ajouté !', 'Success!');

                // Fin de la barre de chargement 
                this.slimLoadingBarService.complete();  

            // On redirige
                this.router.navigate([ 'contactlists/edit/' + data[0]['id'] ])      ;
              
            }
            else
            {
              this.toastr.error('On a pas récupéré de ID !', 'Success!');
                this.router.navigate([ '/contacts' ])      ;
            }
          }
      );     
      
  }

}
