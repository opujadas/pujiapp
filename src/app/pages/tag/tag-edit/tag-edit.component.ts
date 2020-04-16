import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Tag } from './../../../core/model/tag/tag.model';
import { Category } from './../../../core/model/category/category.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { TagService } from './../../../core/service/tag.service';
import { CategoryService } from './../../../core/service/category.service';

import { AppRoutingModule } from '../../../app-routing.module';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.css']
})


export class TagEditComponent implements OnInit  {

  private id: string;

  editTagForm: FormGroup; 


  // Champs dans le formulaire
  private name : string; 
  private category_id : string;  
  private selected_category_id : string;  
  private category : Category;

  private tag : Tag; 

  private categories : any; // Corriger pour mettre : Category[]; 
  subscription : Subscription; 
  subscription2 : Subscription; 

  constructor(
    private slimLoadingBarService: SlimLoadingBarService, 
    public toastr: ToastsManager, 
    private router: Router, 
    private route: ActivatedRoute,
    private _categorieService: CategoryService,
    private _tagService : TagService, 
    private socket: Socket) { }

  ngOnInit() {

    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
    
    this.subscription = this.route.params
      .subscribe((params: Params) => {
            this.id = params['id'];      
            this.subscription2 = this._tagService.getTag(this.id)
              .subscribe(data => {
                console.log(data);
                  if (data.data) {
                    this.tag = data.data; 
                    console.log(this.tag); 


                    this.name = data.data.name; 
                    this.category_id = data.data.category;        
                    this.selected_category_id = data.data.category;        
                     
                    console.log(this.category_id); 

                  }
      }); 
    }); 
            
    // On charge les différentes catégories de tags
    this.subscription2 = this._categorieService.getCategories()
      .subscribe(data => {
        console.log(data); 
        if (data.data){
          this.categories = data.data; 
          this.toastr.success('Les catégories sont chargées !', 'Success !');    
        }
    });

    this.editTagForm = new FormGroup({
      'name': new FormControl(null, Validators.required), 
      'category_id': new FormControl(null, Validators.required)
    });
  
    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }


  onSubmit() {

    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });
  
    this.name = this.editTagForm.value.name;

    // Pour la catégorie, on met juste le ID (on laisse à blanc les autres paramètres puisqu'il n'y a que le ID de la cat qui nous intéresse)
    let tag = new Tag(this.id, this.editTagForm.value.name, new Category(this.editTagForm.value.category_id, '', ''));   

    return this._tagService.editTag(tag).subscribe(
          data => {
            console.log(data); 
              // On toaste
              this.toastr.success('Le tag a bien été modifié !', 'Success !');

              // On envoie un message pour les autres utilisateurs connectés
              var messageSocket = new MessageSocket(
                  'Le tag ' + this.name + ' vient d\'être édité par XXX',
                  'success',
                  tag,
                  'edit_tag'
                ); 

              this.socket.emit("message", messageSocket);              
          },
          error => console.log("Error: ", error),
          () => 
          {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/tags' ])
        });     
      }
  }