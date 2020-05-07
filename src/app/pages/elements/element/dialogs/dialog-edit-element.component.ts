// Core components
import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms'; 

// Plugins & modules 
import { TranslateService } from 'ng2-translate';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
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

  editPostForm: FormGroup; 

  private subscription: Subscription;
  private subscriptionUpdate: Subscription;
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

    console.log('Dialog constructeur'); 

    this.editPostForm = new FormGroup({
      'title': new FormControl(null, Validators.required), 
      'content': new FormControl(null, Validators.required)
    });
  }



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

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionUpdate)
      this.subscriptionUpdate.unsubscribe();
  }

}
