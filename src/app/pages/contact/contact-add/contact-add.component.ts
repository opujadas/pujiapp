import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Contact } from './../../../core/model/contact/contact.model';
import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css']
})


export class ContactAddComponent implements OnInit {

  addContactForm: FormGroup; 

  private nom : string;
  private prenom : string;
  private telephone : string;
  private actif : number = 1;
  private role_id : number;
  private site_id : number; 

  roles : any;  
  sites : any;  
  
    constructor(private slimLoadingBarService: SlimLoadingBarService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private dataService: DataService) {

      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

     }

  ngOnInit() 
  {
    this.addContactForm = new FormGroup(
    {
      'nom': new FormControl(null, Validators.required), 
      'prenom': new FormControl(null, Validators.required),
      'telephone': new FormControl(),
      'actif': new FormControl(false),
      'role_id': new FormControl(),
      'site_id': new FormControl()
    });

      // On charge les différents roles pour les contacts 
      this.dataService.getContactRoles()
        .subscribe(
          data => 
          {
            console.log(data); 
            this.roles = data; 
              // On toaste
              this.toastr.success('Les rôles sont chargés !', 'Success!');

          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  
          }
      );

      // On charge les différents roles pour les contacts 
      this.dataService.getSites()
        .subscribe(
          data => 
          {
            console.log(data); 
            this.sites = data;
            console.log(this.sites);  
            // On toaste
             this.toastr.success('Les sites sont chargés !', 'Success!');
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();  
          }
      );

  }


  onSubmit()
  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    this.nom = this.addContactForm.value.nom;
    this.prenom = this.addContactForm.value.prenom;
    this.telephone = this.addContactForm.value.telephone;
    this.actif = this.addContactForm.value.actif;
    this.role_id = this.addContactForm.value.role_id;
    this.site_id = this.addContactForm.value.site_id;

    let contact = new Contact(
      this.nom,
      this.prenom,
      this.telephone,
      this.actif, 
      this.role_id,
      this.site_id                
    );   

    console.log(contact); 

      return this.dataService.addContact(contact)
        .subscribe(
          data => 
          {
              // On toaste
              this.toastr.success('Le contact a bien été ajouté !', 'Success!');

          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  

          // On redirige
              this.router.navigate([ '/contacts' ])      ;
          }
      );     
  }
}