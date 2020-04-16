import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Site } from './../../../core/model/site/site.model';
import { SiteService } from '../site.service';

import { AppRoutingModule } from '../../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.css']
})


export class SiteEditComponent implements OnInit {

/* ['code_site', 'ville', 'adresse', 'cp', 'telephone']; */

  editSiteForm: FormGroup; 

  private id : number; //  = 'Lille'; 
  private code_site : string; //  = 'Lille'; 
  private ville : string; //  = 'Lille'; 

  private adresse : string; //  = 'Lille'; 
  private adresse2 : string; //  = 'Lille'; 
  private cp : string; //  = 'Lille'; 
  private telephone : string; //  = 'Lille'; 

  private regions : any; 
  private region_id : number; //  = 'Lille'; 

  private subscription : Subscription;
  
    constructor(private slimLoadingBarService: SlimLoadingBarService, 
                public toastr: ToastsManager, 
                vcr: ViewContainerRef, 
                private router: Router, 
                private route: ActivatedRoute,
                private dataService: DataService,
                private siteService: SiteService) 
    {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    this.toastr.success('ADD site !!', 'Success!');
   
      this.subscription = this.siteService.currentSiteChanged
        .subscribe(data => 
        {
          console.log('ICI  : currentSiteChanged');
          console.log(data); 

          this.code_site = data.code_site; 
          this.ville = data.ville; 
          this.adresse = data.adresse;  
          this.adresse2 = data.adresse2;  
          this.cp = data.cp;
          this.id = data.id;
          this.telephone = data.telephone;
          this.region_id = data.region_id;
          // console.log(this.contact); 


      console.log('INIT FORM');

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

  ngOnInit() 
  {

    this.id = +this.route.snapshot.url[2].path; 
    
    console.log('ID : ' + this.id); 

    this.route.params
      .subscribe(
        (params: Params) => {
            this.id = +params['id'];
            this.siteService.getSite(this.id); 
        // Dans tous les cas on initialise le formulaire
        console.log('Initialisation du form'); 
        }
      );

      this.initForm();
  }

  private initForm() 
  {
    this.editSiteForm = new FormGroup(
    {
      'code_site': new FormControl(null, Validators.required), 
      'ville': new FormControl(null, Validators.required),
      'adresse': new FormControl(),
      'adresse2': new FormControl(),
      'cp': new FormControl(false),
      'telephone': new FormControl(),
      'region_id': new FormControl()
    });
    
      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();  
  }


  onSubmit()
  {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.editSiteForm); 
    console.log('site saisi : ' + this.editSiteForm.value.code_site);
  
/*
  private code_site : string; //  = 'Lille'; 
  private ville : string; //  = 'Lille'; 
  private adresse : string; //  = 'Lille'; 
  private cp : boolean; //  = 'Lille'; 
  private telephone : number; //  = 'Lille'; 
*/

    this.code_site = this.editSiteForm.value.code_site;
    this.ville = this.editSiteForm.value.ville;
    this.adresse = this.editSiteForm.value.adresse;
    this.adresse2 = this.editSiteForm.value.adresse2;
    this.cp = this.editSiteForm.value.cp;
    this.telephone = this.editSiteForm.value.telephone;
    this.region_id = this.editSiteForm.value.region_id;

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

      return this.dataService.updateSite(this.id, site)
        .subscribe(
          data => 
          {
              // On toaste
              this.toastr.success('Le site a bien été modifié !', 'Success!');

          // Fin de la barre de chargement 
          this.slimLoadingBarService.complete();  

          // On redirige
              this.router.navigate([ '/sites' ])      ;
          }
      );     
  }

}
