import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Tag } from './../../../core/model/tag/tag.model';
import { Category } from './../../../core/model/category/category.model';

import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-tag-add',
  templateUrl: './tag-add.component.html',
  styleUrls: ['./tag-add.component.css']
})


export class TagAddComponent implements OnInit, OnDestroy  {

  addTagForm: FormGroup; 

  private name : string; 
  private category : Category; 
  private subscription: Subscription;
  private categories : Category[]; // Corriger pour mettre : Category[]; 
  
    constructor(
      private slimLoadingBarService: SlimLoadingBarService, 
      public toastr: ToastsManager, 
      vcr: ViewContainerRef, 
      private router: Router, 
      private _dataService: DataService,
      private socket: Socket,
      private _translate: TranslateService) {

     }

  ngOnInit() {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();
    
    this.addTagForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'category': new FormControl()
    });
    
    // On charge les différentes catégories de tags
    this.subscription = this._dataService.getCategories()
      .subscribe((data) => { // .subscribe((data : Category[]) => {
        console.log('categories récupérées ');
        console.log(data);  
          this.categories = data.data; 
          this.toastr.success('Les catégories sont chargés !', 'Success!');
          this.slimLoadingBarService.complete();  
    });

    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }


  onSubmit()  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();

    this.name = this.addTagForm.value.name;
    this.category = this.addTagForm.value.category;

    console.log('Categorie à ajouter ? '); 
    console.log(this.category); 

    let tag = new Tag(
      -1, 
      this.name,
      this.category,
      localStorage.getItem('user_id')
    );   

    return  this._dataService.addTag(tag)
        .subscribe( data => {
          console.log(data);
            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.TAG.ADD.SUCCESS').subscribe((res: string) => {
                console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.TAG.ADD.EMIT.SUCCESS', {value: this.name}).subscribe((res: string) => {
                console.log(res);
                var messageSocket = new MessageSocket(res, 'success', tag, 'add_tag'); 
                this.socket.emit("message", messageSocket);
              });    
          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/tags' ])
          });     
  }




  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}