// Core components
import { Component, Input, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms'; 

// Plugins & modules 
import { TranslateService } from 'ng2-translate';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Custom models
import { Element } from './../../../core/model/element/element.model';

// Custom services
import { ElementService } from './../../../core/service/element.service';
import { DialogEditPost } from './dialogs/dialog-edit-element.component';



@Component({
  selector: 'element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})

export class ElementComponent  implements OnDestroy {

  // Custom variables & attributes

  @Input()
  element : Element; 

  private elementPreEdition : Element; 

  // Subscriptions
  private subscriptionAddTag :      Subscription;
  private subscriptionDeleteTag :   Subscription; 
  private subscriptionUpdate :      Subscription; 

  constructor(
    private _elementService : ElementService, 
    public dialog: MatDialog,
    public toastr: ToastsManager, 
    private _translate: TranslateService 
    )  {     
  }

  /* Fonction deleteTag(event) 
      => event : number => correspond au numéro du tag à supprimer
      Supprime le tag de la liste des tags de l'élément (BDD + dans la vue)
  */

  deleteTag(event){

      let index = (this.element.tags).findIndex(x => x._id == event); 
      if (index == -1){ // chaine non trouvée
        // On envoie un message à l'utilisateur
        this._translate.get('TOASTER.TAG.DELETE_FROM_ELEMENT.WARNING').subscribe((res: string) => {
            this.toastr.success(res, 'Warning !');
        });                                                     
      } else { // chaine trouvée
         // On supprime le tag de la BDD
         this.subscriptionDeleteTag = this._elementService
                                        .deleteTagFromElement(event, this.element._id)
                                        .subscribe(data => { console.log(data); }); 
         // On supprime visuellement le tag
         this.element.tags.splice(index , 1); 

          // On envoie un message à l'utilisateur
          this._translate.get('TOASTER.TAG.DELETE_FROM_ELEMENT.SUCCESS').subscribe((res: string) => {
              this.toastr.success(res, 'Success!');
          });                                        }     
  }


  /* Fonction editElement(element) 
      Edition d'un élément : 
      - on va ouvrir la boite de dialogue pour pouvoir éditer l'élément
      - on fait une sauvegarde avant si jamais on doit annuler des modifications
  */

  editElement(element) : void {
    // On clone l'élement actuel si jamais on doit annuler des modifications : 
    this.elementPreEdition = JSON.parse(JSON.stringify(this.element)); 
    this.element = element; 
        
    let dialogRef = this.dialog.open(DialogEditPost, {
      width: '40%',
      data: this.element
    });

    dialogRef.afterClosed().subscribe(result => {

      // Si on a validé une mise à jour, on a un result
      if (result !== undefined){
        // On met à jour la BDD pour associer le event.dragData au post
        this.subscriptionUpdate = this._elementService
                                .updateElement(this.element)
                                .subscribe(data => {});
        // On toaste pour l'utilisateur en cours
        this._translate.get('TOASTER.ELEMENT.UPDATE.SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, 'Success !');
        });                                  
      } 
      // Si on a annulé l'édition, le result est undefined
      else {
          this.element = JSON.parse(JSON.stringify(this.elementPreEdition));

          // On toaste pour l'utilisateur en cours
          this._translate.get('TOASTER.ELEMENT.UPDATE.CANCEL').subscribe((res: string) => {
              this.toastr.info(res, 'Information');
          });                                            
      }     
    });
  }


  /* Fonction addToTags(event) 
      => event : Tag => ajoute le tag à la liste des tags de l'élément (BDD + dans la vue)
  */  
    addToTags(event){

      if(event.dragData.ref == 'tag'){      

        if ((this.element.tags).findIndex(x => x._id == event.dragData._id) == -1){
          // Tag non trouvé dans la liste des tags de l'élément : on ajoute !
          // On met à jour la BDD pour associer le event.dragData au post
          this.subscriptionAddTag = this._elementService
                                      .addTagToElement(event.dragData._id, this.element._id)
                                      .subscribe(data => { console.log(data); }); 
        
          // Visuellement, on ajoute le tag à l'élément
          this.element.tags.push(event.dragData);      

          // On envoie un message à l'utilisateur
          this._translate.get('TOASTER.TAG.ADD_TO_ELEMENT.SUCCESS').subscribe((res: string) => {
              this.toastr.success(res, 'Success!');
          });                                  
        }
        else {
          // Tag déjà dans la liste, on ne fait rien ! 
          // On envoie un message à l'utilisateur
          this._translate.get('TOASTER.TAG.ADD_TO_ELEMENT.INFO').subscribe((res: string) => {
              this.toastr.info(res, 'Info !');
          });                                  
        }
      }
      else {
        console.log('DnD d\'un autre element'); 
      }
    }


  /* Fonction ngOnDestroy() 
      - On se désabonne de tout !
  */

  ngOnDestroy() {
    if(this.subscriptionAddTag)
      this.subscriptionAddTag.unsubscribe();
    if(this.subscriptionDeleteTag)
      this.subscriptionDeleteTag.unsubscribe();
    if(this.subscriptionUpdate)
      this.subscriptionUpdate.unsubscribe();
  }
}

