import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Category } from './../../../core/model/category/category.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { CategoryService } from './../../../core/service/category.service';

import { AppRoutingModule } from '../../../app-routing.module';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})


export class CategoryEditComponent implements OnInit  {
  private id: string;

  editCategoryForm: FormGroup; 


  private name : string; 
  private color : string; 

  subscription : Subscription; 
  subscription2 : Subscription; 
  

  constructor(
    private slimLoadingBarService: SlimLoadingBarService, 
    public toastr: ToastsManager, 
    private router: Router, 
    private route: ActivatedRoute,
    private _dataService: DataService,
    private _categoryService : CategoryService, 
    private socket: Socket) {
      console.log('Category edit component'); 
   }

  ngOnInit() {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
    
    this.subscription = this.route.params.subscribe((params: Params) => {
      console.log(params); 
      this.id = params['id'];

      // On fait un checke rapide pour rediriger si quelqu'un essaye d'éditer la catégorie poubelle (PIRATE !)
      
      /*
      if (this.id == -1) {                  
          this.toastr.error('On ne peut pas éditer la catégorie poubelle', 'Error !');
          this.router.navigate([ '/categories/' ]);
      }
      */

      this.subscription2 = this._categoryService.getCategory(this.id)
        .subscribe(data => {
            console.log('message : '); 
            console.log(data); 
            if (data.data){

              this.name = data.data.name; 
              this.color = data.data.color; 
              // this.dataSource = new MatTableDataSource(data);
            }
        }); 
    });             

    this.editCategoryForm = new FormGroup({
      'name': new FormControl(null, Validators.required), 
      'color': new FormControl(null, Validators.required)
    });
  
    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }


  onSubmit()  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.editCategoryForm); 
    console.log('Title saisi : ' + this.editCategoryForm.value.name);
    console.log('Color saisi : ' + this.editCategoryForm.value.color);
  
    this.name = this.editCategoryForm.value.name;
    this.color = this.editCategoryForm.value.color;

    let category = new Category(
      this.id,
      this.name,
      this.color                
    );   

    console.log(category); 

    return  this._categoryService.editCategory(category).subscribe(
      data => {
        // On toaste
        this.toastr.success('Le category a bien été modifié !', 'Success!');

        // On envoie un message pour les autres utilisateurs connectés
        var messageSocket = new MessageSocket(
            'Le category ' + this.name + ' vient d\'être édité par XXX',
            'success',
            category,
            'edit_category'
          ); 

        this.socket.emit("message", messageSocket);              
      },
      error => console.log("Error: ", error),
      () => {
        // Fin de la barre de chargement 
        this.slimLoadingBarService.complete();              
        this.router.navigate([ '/categories' ])
      });     
  }
}