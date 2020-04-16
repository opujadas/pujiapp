import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Site } from './../../../core/model/site/site.model';
import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-site-add',
  templateUrl: './site-add.component.html',
  styleUrls: ['./site-add.component.css']
})


export class SiteAddComponent implements OnInit {

/* ['code_site', 'ville', 'adresse', 'cp', 'telephone']; */

  addSiteForm: FormGroup; 

  private code_site : string; //  = 'Lille'; 
  private ville : string; //  = 'Lille'; 
  private adresse : string; //  = 'Lille'; 
  private adresse2 : string; //  = 'Lille'; 
  private cp : string; //  = 'Lille'; 
  private telephone : string; //  = 'Lille'; 

  private regions : any; 
  private region_id : number; //  = 'Lille'; 
  
    constructor(private slimLoadingBarService: SlimLoadingBarService, public toastr: ToastsManager, vcr: ViewContainerRef, private router: Router, private dataService: DataService) {

      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

     }

  ngOnInit() 
  {
    this.toastr.success('ADD site !!', 'Success!');
   


    this.addSiteForm = new FormGroup(
    {
      'code_site': new FormControl(null, Validators.required), 
      'ville': new FormControl(null, Validators.required),
      'adresse': new FormControl(),
      'adresse2': new FormControl(),
      'cp': new FormControl(false),
      'telephone': new FormControl(),
      'region_id': new FormControl()
    });

      // On charge les différents régions pour les sites 
      
      this.dataService.getRegions()
        .subscribe(
          data => 
          {
            console.log(data); 
            this.regions = data; 
              // On toaste
              this.toastr.success('Les régions sont chargées !', 'Success!');
          }
      );    

      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();  
  }


  onSubmit()
  {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.addSiteForm); 
    console.log('site saisi : ' + this.addSiteForm.value.nom);
  
/*
  private code_site : string; //  = 'Lille'; 
  private ville : string; //  = 'Lille'; 
  private adresse : string; //  = 'Lille'; 
  private cp : boolean; //  = 'Lille'; 
  private telephone : number; //  = 'Lille'; 
*/

    this.code_site = this.addSiteForm.value.code_site;
    this.ville = this.addSiteForm.value.ville;
    this.adresse = this.addSiteForm.value.adresse;
    this.adresse2 = this.addSiteForm.value.adresse2;
    this.cp = this.addSiteForm.value.cp;
    this.telephone = this.addSiteForm.value.telephone;
    this.region_id = this.addSiteForm.value.region_id;

    let site = new Site(
      this.code_site,
      this.ville,
      this.adresse,
      this.adresse2,
      this.cp, 
      this.telephone,
      this.region_id
    );   

    console.log(site); 

      return this.dataService.addSite(site)
        .subscribe(
          data => 
          {
              // On toaste
              this.toastr.success('Le site a bien été ajouté !', 'Success!');

          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  

          // On redirige
              this.router.navigate([ '/sites' ])      ;
          }
      );     
  }

}
