// Core components
import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms'; 

// Plugins & modules 
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Custom models
import { Element } from './../../../../core/model/element/element.model';

// Custom services
import { ElementService } from './../../../../core/service/element.service';
import { HtmlcontentPipe } from '../../../../core/pipes/htmlcontent.pipe';


@Component({
  selector: 'dialog-edit-element',
  templateUrl: 'dialog-edit-element.html',
  styleUrls: ['./dialog-edit-element.css']
})

export class DialogEditPost implements OnDestroy  {

  // Custom variables & attributes
  editPostForm: FormGroup; 
  elementBackup : Element; 

  // Modules & plugins variables  
  public Editor = ClassicEditor;

  // Subscriptions
  private subscription :        Subscription;
  private subscriptionUpdate :  Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPost>,
    private _elementService : ElementService,  
    @Inject(MAT_DIALOG_DATA) public element: Element) { 

    console.log('Dialog constructeur'); 

    this.editPostForm = new FormGroup({
      'title': new FormControl(null, Validators.required), 
      'content': new FormControl(null, Validators.required)
    });
  }


  /* Fonction onSubmit() 
      => mise à jour d'un élément 
  */

  onSubmit(){
    // On met à jour la BDD pour associer le event.dragData au post
    this.subscriptionUpdate = this._elementService
            .updateElement(this.element)
            .subscribe(data => {
                // Ici on passe la data en paramètre pour différencier
                // une action avec mise à jour (comme ici), d'une action annulée
                this.dialogRef.close(data); 

     });  
  }


  /* Fonction onNoClick() 
      => Si on ferme le dialogue, on annule les éventuelles modifications
         Du coup on renvoie close() sans paramètres, ça sera intercepté par l'elementcomponent 
  */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /* Fonction ngOnDestroy() 
      - On se désabonne de tout !
  */

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionUpdate)
      this.subscriptionUpdate.unsubscribe();
  }
}