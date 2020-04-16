import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../core/data/data.service';
import { CategoryListService } from './category-list/category-list.service';
import { CategoryListComponent } from './category-list/category-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'ng-socket-io';
import { Category } from './../../core/model/category/category.model';

import {TranslateService} from 'ng2-translate';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

  private categories: Category[]; 
  // private subscription: Subscription;
  //socket = io('http://localhost:3000');

  constructor(private slimLoadingBarService: SlimLoadingBarService, 

              private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService
               ) 
  { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

      // Translations 
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en');
    	
      console.log('On est dans le category component, on va chopper la liste des categorys'); 
    	// this.dataStorageService.getRecipes();


      
      // this.socket.emit("message", 'Un utilisateur est connecté sur la page des categorys');
 
 /*   this.socket.on('message_add_category', function (data) {
      console.log('Je recois le message_add_category'); 
      // this.toastr.success(data, 'Success!');
      console.log('Nouveau category créé par un autre user');
      console.log(data);  
    }.bind(this));*/

  }



  ngOnInit() {

/*
    this.socket.on('new_connexion', function (data) {
      this.toastr.success('NOUVEAU message reçu du serveur !' + data, 'Success!');
      console.log('NOUVEAU message reçu du serveur !');
      console.log(data);  
    }.bind(this));
*/
  	// initialement on charge la liste des categorys
/*    this.subscription = this.categoryListService.getCategorys()
      .subscribe(data => 
      {
          console.log('categorys : '); 
          console.log(data);
          
          this.categorys = Object.values(data); 
          console.log('***********');
          console.log(this.categorys); 
          console.log('***********');
      });
  */    
      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();

  }


  onNewCategory() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }  
}
