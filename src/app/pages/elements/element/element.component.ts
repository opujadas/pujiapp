import { Component, Input, OnDestroy, Inject } from '@angular/core';

import { Element } from './../../../core/model/element/element.model';
import { ElementService } from './../../../core/service/element.service';

import { Subscription } from 'rxjs/Subscription';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FormGroup, FormControl } from '@angular/forms'; 
import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

/*import { TagListService } from './../../../core/service/tag-list.service';

import { TagService } from './../../../core/service/tag.service';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';

import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
*/
import { HtmlcontentPipe }          from '../../../core/pipes/htmlcontent.pipe';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';




@Component({
  selector: 'element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})

export class ElementComponent  implements OnDestroy {
  @Input()
  element : Element; 

  private subscriptionAddTag: Subscription;
  private subscriptionDeleteTag : Subscription; 
  private subscriptionUpdate : Subscription; 

  constructor(
    private _elementService : ElementService, 
    public dialog: MatDialog,
    public toastr: ToastsManager, 
    private _translate: TranslateService, 
    )  {     
  }

  /* Fonction deleteTag(event) 
      => event : number => correspond au numéro du tag à supprimer
      Supprime le tag de la liste des tags de l'élément (BDD + dans la vue)
  */

  deleteTag(event){
    this.subscriptionDeleteTag = this._elementService.deleteTagFromElement(event, this.element._id)
                        .subscribe(data => {
                            console.log(data); 
                        }); 

      console.log(this.element.tags);

      let index = (this.element.tags).findIndex(x => x._id == event); 
      if (index == -1){
        console.log('chaine non trouvée');
      } else {
         console.log('index trouvé : ');
         this.element.tags.splice( ((this.element.tags).findIndex(x => x._id == event)), 1); 
      }     
  }

  editElement(element) : void {

    console.log('On ouvre une fenetre dialogue pour affichier / editer element'); 
    console.log(element); 

 
    this.element = element;
        
    let dialogRef = this.dialog.open(DialogEditPost, {
      width: '40%',
      data: this.element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
      // this.refreshList(); 
    // On met à jour la BDD pour associer le event.dragData au post
    this.subscriptionUpdate = this._elementService.updateElement(this.element)
                            .subscribe(data => {
                                console.log(data);
                                // this.dialogRef.close();
/*
        // On toaste pour l'utilisateur en cours
        this._translate.get('TOASTER.ELEMENT.UPDATE.SUCCESS').subscribe((res: string) => {
            console.log(res);
            this.toastr.success(res, 'Success!');
        });                                  
  */    
      });       
    });
     
  }


  /* Fonction addToTags(event) 
      => event : Tag => ajoute le tag à la liste des tags de l'élément (BDD + dans la vue)
  */  
    addToTags(event){

      console.log(event);
      if(event.dragData.ref == 'tag'){      
        console.log('Ajouter aux tags de element : ' + this.element._id);

        if ((this.element.tags).findIndex(x => x._id == event.dragData._id) == -1){
          console.log('non trouvé, on ajoute !');
          // On met à jour la BDD pour associer le event.dragData au post
          this.subscriptionAddTag = this._elementService
                                      .addTagToElement(event.dragData._id, this.element._id)
                                      .subscribe(data => { console.log(data); }); 
        
          // Visuellement, on ajoute le tag à l'élément
          this.element.tags.push(event.dragData);      

          // On envoie un message à l'utilisateur
          this._translate.get('TOASTER.TAG.ADD_TO_ELEMENT.SUCCESS').subscribe((res: string) => {
              console.log(res);
              this.toastr.success(res, 'Success!');
          });                                  
        }
        else {
          console.log('Tag déjà dans la liste, on ne fait rien !'); 
          // On envoie un message à l'utilisateur
          this._translate.get('TOASTER.TAG.ADD_TO_ELEMENT.INFO').subscribe((res: string) => {
              console.log(res);
              this.toastr.info(res, 'Info !');
          });                                  
        }
      }
      else {
        console.log('DnD d\'un autre element'); 
      }
    }

  ngOnDestroy() {
    if(this.subscriptionAddTag)
      this.subscriptionAddTag.unsubscribe();
    if(this.subscriptionDeleteTag)
      this.subscriptionDeleteTag.unsubscribe();

  }
}





@Component({
  selector: 'dialog-edit-element',
  templateUrl: 'dialog-edit-element.html',
  styleUrls: ['./element.component.css']
})
export class DialogEditPost implements OnDestroy  {

  editPostForm: FormGroup; 

  private subscription: Subscription;
  private subscriptionUpdate: Subscription;
  // param : any; // titre du post à supprimer
  elementBackup : Element; 
  oldtitle : string; 
  oldcontent : string; 
  public Editor = ClassicEditor;



  constructor(
    public dialogRef: MatDialogRef<DialogEditPost>,
    private _elementService : ElementService,  
    public toastr: ToastsManager, 
    private _translate: TranslateService, 
    @Inject(MAT_DIALOG_DATA) public element: Element) { 

    // if (element.data.title) this.oldtitle = element.data.title; 
    // if (element.data.content) this.oldcontent = element.data.content; 

    // On injecte le titre du post pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    // this.element = element;
    console.log('Element depuis le dialogue :'); 
    console.log(this.element); 
    console.log('Dialog constructeur'); 

    this.editPostForm = new FormGroup({
      'title': new FormControl(null, Validators.required), 
      'content': new FormControl(null, Validators.required)
    });
  }


  onSubmit(){
    console.log('Submit'); 
    console.log(this.element);
    console.log('Elément updaté ?'); 
    console.log(this.editPostForm); 

    // On met à jour la BDD pour associer le event.dragData au post
    this.subscriptionUpdate = this._elementService.updateElement(this.element)
                            .subscribe(data => {
                                console.log(data);
                                this.dialogRef.close();

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

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionUpdate)
      this.subscriptionUpdate.unsubscribe();
  }

}