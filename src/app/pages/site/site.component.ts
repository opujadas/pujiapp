import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { SiteListService } from './site-list/site-list.service';
//import { ContactListComponent } from './contact-list/contact-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';

import { Site } from './../../core/model/site/site.model';


@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  private sites: Site[]; 


  constructor(private slimLoadingBarService: SlimLoadingBarService, 
              private dataService: DataService, 
              private siteListService: SiteListService,
              private router: Router,
              private route: ActivatedRoute) 
  { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    	console.log('On est dans le site component, on va chopper la liste des sites'); 
    	// this.dataStorageService.getRecipes();
  }



  ngOnInit() {

  	// initialement on charge la liste des sites

    /*
    this.contactListService.getSites()
      .subscribe(data => 
      {
          console.log('sites : '); 
          console.log(data); 
          this.sites = data.a; 
      });
      */
      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();

  }


  onNewSite() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }
}
