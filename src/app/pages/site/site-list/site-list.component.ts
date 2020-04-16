import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DataService } from '../../../core/data/data.service';
import { SiteListService } from './site-list.service';
import { SiteService } from '../site.service';

import { Site } from './../../../core/model/site/site.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, Sort, MatSort} from '@angular/material';


@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit, OnDestroy {

  private sites: any; // Site[]; 
  private subscription: Subscription;
  displayedColumns = ['code_site', 'ville', 'adresse', 'region', 'actions'];
  site: Site; 
  dataSource : any; 

  @ViewChild(MatSort) sort: MatSort;


  constructor(private dataService: DataService,
              private siteService: SiteService, 
              private siteListService: SiteListService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) { 
	console.log('On est dans le Site list component, on va chopper la liste des Sites'); 
	// this.dataStorageService.getRecipes();
  	// initialement on charge la liste des Sites
    this.refreshList(); 
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  } 

  deleteSite(site: Site) : void {

    console.log('openDialog - Ouverture dialog'); 
    console.log(site); 
    this.site = site; 
    
    let dialogRef = this.dialog.open(DialogSupprimerSite, {
      width: '40%',
      data: { site: this.site }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('XX The dialog was closed');
      this.refreshList(); 
    });
  }

  ngOnInit() {

        this.subscription = this.siteService.currentSiteChanged
          .subscribe(data => 
          {
            console.log('ON est dans Site list component, on a capté que currentSiteChanged ! '); 
            console.log(data);    
            console.log('On raffrichit la liste des Sites'); 
            this.refreshList(); 
          });
  }

  refreshList()
  {
    console.log('refreshList'); 
    // initialement on charge la liste des Sites
    this.siteListService.getSites()
      .subscribe(data => 
      {
          console.log('Sites : '); 
          console.log(data); 
          this.sites = data; 
          this.dataSource = new MatTableDataSource(Object.values(data));
      });    
  }

  editSite(site: Site)
  {
    console.log('On va éditer le Site : ');
    console.log(site);
    if (site.id)
    {
          console.log('On va éditer le Site : ' + site.id);

          // On redirige
              this.router.navigate([ '/sites/edit/' + site.id ])      ;
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}


@Component({
  selector: 'dialog-supprimer-site',
  templateUrl: 'dialog-supprimer-site.html',
})
export class DialogSupprimerSite {




  constructor(
    public dialogRef: MatDialogRef<DialogSupprimerSite>,
    private siteService: SiteService, 
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log('Ouverture dialog'); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du contact
  deleteSiteConfirm(id: number)
  {
    console.log('deleteContactConfirm'); 
    console.log(id); 
    // Envoyer fonction pour supprimer le contact de la BDD
    this.siteService.deleteSite(id)
      .subscribe(data => 
      {
          console.log('site '); 
          console.log(data); 
      });   
    // Supprimer le contact de la liste actuelle des contacts 

    // Faire action puis fermer la fenêtre
    this.dialogRef.close();
  }
}