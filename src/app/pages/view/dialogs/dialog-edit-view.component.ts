import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from './../../../core/data/data.service';
import { ElementListService } from './../../../core/service/element-list.service';
import { ElementService } from './../../../core/service/element.service';
import { TagListService } from './../../../core/service/tag-list.service';
//import { viewListComponent } from './view-list/view-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Element } from './../../../core/model/element/element.model';
import { Tag } from './../../../core/model/tag/tag.model';
import { Post } from './../../../core/model/post/post.model';

import {MatDividerModule} from '@angular/material/divider';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FormGroup, FormControl } from '@angular/forms'; 
import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';


import { View } from './../../../core/model/view/view.model';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'ng-socket-io';
import { AppRoutingModule } from '../../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ViewService } from './../../../core/service/view.service';

import { TranslateService } from 'ng2-translate';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';




@Component({
  selector: 'dialog-edit-view',
  templateUrl: 'dialog-edit-view.html',
  styleUrls: ['./dialog-edit-view.component.css']
})
export class DialogEditView implements OnDestroy  {

  editViewForm: FormGroup; 

  private subscription: Subscription;
  private subscriptionUpdate: Subscription;
  private subscriptionGetTags: Subscription;
  private subscriptionAddTag: Subscription; 
  private subscriptionDeleteTag: Subscription; 
  // param : any; // titre du View à supprimer
  elementBackup : Element; 
  tags: Tag[]; 

  oldtitle : string; 
  oldcontent : string; 
  private selectableTags: any; 
  private selectedTags = []; 

  constructor(
    public dialogRef: MatDialogRef<DialogEditView>,
    private _viewService : ViewService,  
    private _tagListService : TagListService,
    public toastr: ToastsManager, 
    private _translate: TranslateService, 
    @Inject(MAT_DIALOG_DATA) public view: View) { 

    // if (element.data.title) this.oldtitle = element.data.title; 
    // if (element.data.content) this.oldcontent = element.data.content; 

    // On injecte le titre du View pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    // this.element = element;
    console.log('Element depuis le dialogue :'); 
    console.log(this.view); 
    console.log('Dialog constructeur'); 

    this.editViewForm = new FormGroup({
      'name': new FormControl(null, Validators.required)
    });

    this.subscriptionGetTags = this._tagListService.getTags()
      .subscribe(data =>  {
          if (data.data){
          // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
            this.tags = data.data; 
            console.log('Tags => ');
            console.log(this.tags);

          }
      });    

  }


  onSubmit(){
    console.log('Submit'); 
    console.log(this.view);
    console.log(this.view.name); 

    console.log('Elément updaté ?'); 
    console.log(this.editViewForm); 
    
    console.log('Nom vue : ' + this.editViewForm.value.name);
/*
    console.log('Title saisi : ' + this.editCategoryForm.value.name);
    console.log('Color saisi : ' + this.editCategoryForm.value.color);
  
    this.name = this.editCategoryForm.value.name;
*/
    this.view.name = this.editViewForm.value.name;
    console.log('this.view'); 
    console.log(this.view); 

    // On met à jour la BDD pour associer le event.dragData au View
    this.subscriptionUpdate = this._viewService
        .updateView(this.view)
        .subscribe(data => {
          console.log(data);
          this.dialogRef.close(data);

          // On toaste pour l'utilisateur en cours
          this._translate.get('TOASTER.ELEMENT.UPDATE.SUCCESS').subscribe((res: string) => {
              console.log(res);
              this.toastr.success(res, 'Success!');
          });                                  
    });    
  }

  onNoClick(): void {
    console.log('on no click'); 

    // On réassigne les anciennes valeurs
    // this.element.data.title = this.oldtitle; 
    // this.element.data.content = this.oldcontent; 

    this.dialogRef.close();
  }



  /* Fonction addToTags(event) 
      => event : Tag => ajoute le tag à la liste des tags de l'élément (BDD + dans la vue)
  */  
    addToTags(event){

      console.log(event);
      if(event.dragData.ref == 'tag'){      
        console.log('Ajouter aux tags de la vue  : ' + this.view._id);

        console.log('Add tag to view !!'); 
        console.log(event.dragData); 
        console.log(event.dragData.id); 
        console.log('On ajoute ' + event.dragData.id + ' au view ' + this.view._id); 


        // On met à jour la BDD pour associer le event.dragData au post
        this.subscriptionAddTag = this._viewService.addTagToView(event.dragData._id, this.view._id)
                                .subscribe(data => {
                                    console.log(data); 
                                }); 
        
        // On modifie les listes
        // this.selectableTags.splice(index, 1);

        console.log('On va chercher dans le tag dans les tags de element'); 
        console.log(this.view.tags); 
        console.log(event.dragData._id); 

        if ((this.view.tags).findIndex(x => x._id == event.dragData._id) == -1)
          this.view.tags.push(event.dragData);      
      }
      else {
        console.log('DnD d\'un autre view'); 
      }
    }

  /* Fonction deleteTag(event) 
      => event : number => correspond au numéro du tag à supprimer
      Supprime le tag de la liste des tags de l'élément (BDD + dans la vue)
  */

  deleteTag(event){
    console.log('On va supprimer un tag de la liste des tags de la vue : '); 
    console.log(this.view._id); 
    this.subscriptionDeleteTag = this._viewService.deleteTagFromView(event, this.view._id)
                        .subscribe(data => {
                            console.log(data); 
                        }); 

      console.log(); 
      let index = (this.view.tags).findIndex(x => x._id == event); 
      if (index == -1){
        console.log('chaine non trouvée');
      } else {
         console.log('index trouvé : ');
         this.view.tags.splice( ((this.view.tags).findIndex(x => x._id == event)), 1); 
      }     
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionUpdate)
      this.subscriptionUpdate.unsubscribe();
    if (this.subscriptionAddTag)
      this.subscriptionAddTag.unsubscribe();
    if (this.subscriptionDeleteTag)
      this.subscriptionDeleteTag.unsubscribe();
    if (this.subscriptionGetTags)
      this.subscriptionGetTags.unsubscribe();
  }

}