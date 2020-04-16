
import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { DataService } from '../../core/data/data.service';

import { ListContactService } from './../../core/service/list-contact.service';
/*
import { ContactListComponent } from './contact-list/contact-list.component';
*/
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {MatTableDataSource, MatSort, MatGridListModule} from '@angular/material';

// import { Contact } from './contact.model';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit, OnDestroy {

  private listcontacts: any;
  displayedColumns = ['nom', 'actions'];
  dataSource : any;
  subscription: Subscription;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  constructor(private slimLoadingBarService: SlimLoadingBarService, 
              private dataService: DataService, 
              private listContactService: ListContactService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) 
  { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
    	console.log('On est dans le contact component, on va chopper la liste des contacts'); 
  }

  @ViewChild(MatSort) sort: MatSort;


  ngOnInit() {

  	// initialement on charge la liste des contacts

    
    this.refreshList();
      
      // Fin de la barre de chargement 

      this.slimLoadingBarService.complete();
  }

  refreshList()
  {
    this.subscription = this.listContactService.getContactLists()
      .subscribe(data => 
      {
          console.log('contacts lists : '); 
          console.log(data); 
          this.listcontacts = data; 
          this.dataSource = new MatTableDataSource(Object.values(data));
      });
  }


  deleteContactList(cl) : void {

    console.log('openDialog - Ouverture dialog'); 
    console.log(cl); 
    
    let dialogRef = this.dialog.open(DialogSupprimerContactList, {
      width: '40%',
      data: { contactlist: cl }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('XX The dialog was closed');
      this.refreshList(); 
    });
  }

  onNewContactList() {
    
      this.router.navigate(['add'], {relativeTo: this.route});
    
  }

  editContactlist(element)
  {
    console.log(element); 
    this.router.navigate(['edit/' + element.id], {relativeTo: this.route});

  }

  ngOnDestroy() {
    console.log('LIST CONTACT COMPONENT / unsubscribe'); 
    this.subscription.unsubscribe();
  }  
}





@Component({
  selector: 'dialog-supprimer-contactlist',
  templateUrl: 'dialog-supprimer-contactlist.html',
})
export class DialogSupprimerContactList {

  constructor(
    public dialogRef: MatDialogRef<DialogSupprimerContactList>,
    private listContactService: ListContactService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log('Ouverture dialog'); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du contact
  deleteContactlistConfirm(list_id)
  {
    console.log('deleteContactConfirm'); 
    console.log(list_id); 

    // Envoyer fonction pour supprimer le contact de la BDD
    this.listContactService.deleteContactList(list_id)
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