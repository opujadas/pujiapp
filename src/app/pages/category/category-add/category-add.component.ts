import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';
import { AuthService } from '../../../guard/auth.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Category } from './../../../core/model/category/category.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})


export class CategoryAddComponent implements OnInit, OnDestroy  {


  /* Variable and attributes */

  addCategoryForm: FormGroup; 

  private name : string; 
  private color : string; 
  private subscription: Subscription;
  private subscriptionCurrentUser: Subscription;
    
  /* Contructor */

  constructor(
    private slimLoadingBarService: SlimLoadingBarService, 
    public toastr: ToastsManager, 
    vcr: ViewContainerRef, 
    private router: Router, 
    private _dataService: DataService,
    private _authService: AuthService,
    private socket: Socket) {

    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
   }


  ngOnInit() {
    this.addCategoryForm = new FormGroup({
      'name': new FormControl(null, Validators.required), 
      'color': new FormControl(null, Validators.required)
    });
    
    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }


  onSubmit() {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
      this.name = this.addCategoryForm.value.name;
      this.color = this.addCategoryForm.value.color;

     //    console.log(JSON.parse(localStorage.getItem('user_id'))); 
        console.log(localStorage.getItem('user_id')); 
/*
    this.subscriptionCurrentUser = this._authService.getCurrentUser()
        .subscribe(data => {
          console.log('Current User'); 
          console.log(data); 
        }); 
*/
    let category = new Category(
      "-1", 
      this.name,
      this.color,
      localStorage.getItem('user_id')
    );   

    console.log(category); 

    this.subscription = this._dataService.addCategory(category)
        .subscribe(data => {
            console.log('data'); 
            console.log(data); 
              // On toaste pour l'utilisateur en cours
              this.toastr.success('La catégorie ' + category.name + ' a bien été créée', 'Success!');

              // On envoie un message pour les autres utilisateurs connectés
              var messageSocket = new MessageSocket(
                  'Un utilisateur vient d\'ajouter la catégorie : ' + category.name,
                  'info',
                  category,
                  'add_category'
                ); 

              this.socket.emit("message", messageSocket);
          },
          error => console.log("Error: ", error),
          () => 
          {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/categories' ])
          });     
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
   
  }
}
