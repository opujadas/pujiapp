import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Contact } from './../../../core/model/contact/contact.model';
import { ListContact } from './../../../core/model/list-contact/list-contact.model';
import { ListContactService } from './../../../core/service/list-contact.service';
import { AppRoutingModule } from './../../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-list-contact-edit',
  templateUrl: './list-contact-edit.component.html',
  styleUrls: ['./list-contact-edit.component.css']
})


export class ListContactEditComponent implements OnInit {
  id: number;

  editContactListForm: FormGroup; 

  private nom : string; //  = 'Lille'; 
  contacts : Contact[]; 
  displayedColumns = ['nom', 'code_site', 'ville', 'region', 'actions'];
  displayedColumns2 = ['nom', 'code_site', 'ville', 'region', 'actions'];

  dataSource_contacts_affectes : any; 
  dataSource_contacts_disponibles : any; 
  private subscription: Subscription;
  private subscription2: Subscription;

// editContactListForm
  contacts_affectes : any; 
  contacts_disponibles : any; 

  @ViewChild(MatSort) sort: MatSort;
  
  constructor(    private slimLoadingBarService: SlimLoadingBarService, 
                  public toastr: ToastsManager, 
                  vcr: ViewContainerRef, 
                private router: Router, 
                private route: ActivatedRoute,
                  private dataService: DataService,
                  private listContactService: ListContactService, 
                  private changeDetectorRefs: ChangeDetectorRef
                  ) 
  {

      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

  }



  refresh()
  {

        this.subscription = this.listContactService.getContactsInContactlist(this.id)
          .subscribe(
            data => 
            {
              console.log('On récupère les contacts de notre liste'); 
              console.log(data); 
              this.contacts_affectes = data; 
              this.dataSource_contacts_affectes = new MatTableDataSource(Object.values(data));
              console.log('DataSource'); 
              console.log(this.dataSource_contacts_affectes); 
            }
        );        




        this.subscription2 = this.listContactService.getContactsNotInContactlist(this.id)
          .subscribe(
            data => 
            {
              console.log('On récupère les contacts affectables'); 
              console.log(data); 
              this.contacts_disponibles = data; 
              this.dataSource_contacts_disponibles = new MatTableDataSource(Object.values(data));

            }
        );  

      this.changeDetectorRefs.detectChanges(); 
  }



  ngOnInit() 
  {
    this.toastr.success('ADD CONTACT LIST !!', 'Success!');

    this.id = +this.route.snapshot.url[2].path; 
    
    console.log('ID : ' + this.id); 

    this.route.params
      .subscribe(
        (params: Params) => {
            this.id = +params['id'];
            
    this.listContactService.getListcontact(this.id)
      .subscribe(data => 
      {
          console.log('contacts : '); 
          console.log(data); 
          this.nom = data[0].nom; 
          // this.dataSource = new MatTableDataSource(data);
      });    
      
          
            // this.siteService.getSite(this.id); 
        // Dans tous les cas on initialise le formulaire
        console.log('Initialisation du form'); 
        

        this.editContactListForm = new FormGroup(
        {
          'nom': new FormControl(this.nom)
        });
        }
      );


      this.refresh(); 
     

        /*
    this.initForm();
    
    this.addContactListForm = new FormGroup(
    {
      'nom': new FormControl(null, Validators.required), 
    });

      // On charge les différents roles pour les contacts 
      

      */
    
          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  
  }


  affectContact(contact, index)
  {
        // this.dataSource_contacts_affectes.data.push(contact); 
      this.contacts_affectes.push(contact);
      this.dataSource_contacts_affectes.data.push(contact); 

      this.contacts_disponibles.splice(index, 1);
      this.dataSource_contacts_disponibles.data.splice(index, 1);


    this.listContactService.addContactsInContactlist(contact.id, this.id)
      .subscribe(
        data => 
        {
          console.log('On affecte le contact'); 
          console.log(data); 
          this.refresh(); 
          // this.contacts_disponibles = data; 
        }
    );   


  // this.listContactService.addContactsInContactlist(contact.id, this.id).unsubscribe();
    
  }

  desaffectContact(contact, index)
  {
    console.log('On va desaffecter le contact : '); 
    console.log(contact); 


    this.contacts_disponibles.push(contact);
    this.dataSource_contacts_disponibles.data.push(contact); 

    this.contacts_affectes.splice(index, 1);
    this.dataSource_contacts_affectes.data.splice(index, 1);


    this.listContactService.deleteContactsFromContactlist(contact.id, this.id)
      .subscribe(
        data => 
        {
          console.log('On affecte le contact'); 
          console.log(data); 
          this.refresh(); 
          // this.contacts_disponibles = data; 
        }
    );   

      
    
    // this.listContactService.deleteContactsFromContactlist(contact.id, this.id).unsubscribe();
  }


  onSubmit()
  {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.editContactListForm); 
    console.log('Contact saisi : ' + this.editContactListForm.value.nom);
  
    this.nom = this.editContactListForm.value.nom;
 

      return this.dataService.updateContactList(this.id, this.nom)
        .subscribe(
          data => 
          {
              // On toaste
              this.toastr.success('La liste de contacts a bien été modifiée !', 'Success!');

          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  

          // On redirige
           //    this.router.navigate([ '/contact' ])      ;
          }
      );     
      
  }


ngOnDestroy() {
  this.subscription.unsubscribe();
  this.subscription2.unsubscribe();
}
}
