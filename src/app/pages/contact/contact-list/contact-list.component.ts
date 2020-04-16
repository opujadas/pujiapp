

import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { ContactListService } from './contact-list.service';
import { ContactService } from './../../../core/service/contact.service';
import { Contact } from './../../../core/model/contact/contact.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';


 

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {

  private contacts = {}; // any[]; // Contact[]; 
  private subscription: Subscription;
  displayedColumns = ['nom', 'prenom', 'telephone', 'role', 'code_site', 'ville', 'region', 'actions'];
  dataSource : any;
  contact : Contact; 

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //  @ViewChild(MatSort) sort: MatSort;
  

  constructor(private contactService: ContactService, 
              private contactListService: ContactListService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) 
  { 
	console.log('On est dans le contact list component, on va chopper la liste des contacts'); 
	// this.dataStorageService.getRecipes();
  	// initialement on charge la liste des contacts
    this.refreshList(); 
  }


  deleteContact(con: Contact) : void {

    console.log('openDialog - Ouverture dialog'); 
    console.log(con); 
    this.contact = con; 
    
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '40%',
      data: { contact: this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('XX The dialog was closed');
      this.refreshList(); 
    });
  }





  ngOnInit() { 

        this.subscription = this.contactService.currentContactChanged
          .subscribe(data => 
          {
            console.log('ON est dans contact list component, on a capté que currentContactChanged ! '); 
            console.log(data);   

            console.log('On raffrichit la liste des contacts'); 
            this.refreshList(); 
          });
  }

  refreshList()
  {
    console.log('refreshList'); 
    // initialement on charge la liste des contacts
    this.contactListService.getContacts()
      .subscribe(data => 
      {
          console.log('contacts : ');  
          console.log(data); 
            console.log('type of data?');  
            console.log(typeof data); 
            console.log('type of this.?');  
            console.log(typeof this.contacts);                       
          this.contacts = data; 

           console.log('type dataosouc : ');
           console.log(typeof new MatTableDataSource(Object.values(data))); 
          console.log('type : ');
          // this.dataSource = new Object(); 
           console.log(this.dataSource);   


          this.dataSource = new MatTableDataSource(Object.values(data));
      });    
  }

  editContact(contact: Contact)
  {
    console.log('On va éditer le contact : ');
    console.log(contact);
    if (contact.id)
    {
          console.log('On va éditer le contact : ' + contact.id);

          // On redirige
              this.router.navigate([ '/contacts/edit/' + contact.id ])      ;
    }
  }



ngOnDestroy() {
  this.subscription.unsubscribe();
}

}



@Component({
  selector: 'dialog-supprimer-contact',
  templateUrl: 'dialog-supprimer-contact.html',
})
export class DialogOverviewExampleDialog {




  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private contactService: ContactService, 
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log('Ouverture dialog'); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du contact
  deleteContactConfirm(contact: Contact)
  {
    console.log('deleteContactConfirm'); 
    console.log(contact); 
    // Envoyer fonction pour supprimer le contact de la BDD
    this.contactService.deleteContact(contact.id)
      .subscribe(data => 
      {
          console.log('contact '); 
          console.log(data); 
      });   
    // Supprimer le contact de la liste actuelle des contacts 

    // Faire action puis fermer la fenêtre
    this.dialogRef.close();
  }
}