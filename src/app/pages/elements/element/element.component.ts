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
import { Element } from './../../../core/model/element/element.model';

// Custom services
import { ElementService } from './../../../core/service/element.service';
import { HtmlcontentPipe }          from '../../../core/pipes/htmlcontent.pipe';



@Component({
  selector: 'element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})

export class ElementComponent  implements OnInit, OnDestroy {

  // Custom variables & attributes

  @Input()
  element : Element; 

  private elementPreEdition : Element; 

  // Subscriptions (don't forget to unsubscribe !)

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

  ngOnInit(){

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
            console.log(res);
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
              console.log(res);
              this.toastr.success(res, 'Success!');
          });                                        }     
  }

  editElement(element) : void {

    // On clone this.view dans backup : 
    this.elementPreEdition = JSON.parse(JSON.stringify(this.element)); 
    console.log('INIT element avant edition : '); 
    console.log(this.elementPreEdition); 
    console.log('On ouvre une fenetre dialogue pour affichier / editer element'); 
    console.log(element); 
 
    this.element = element;
        
    let dialogRef = this.dialog.open(DialogEditPost, {
      width: '40%',
      data: this.element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
      console.log(result); 

      // Si on a validé une mise à jour, on a un result
      if (result !== undefined){
        // On doit raffraichir les vues root, on informe le viewService
        //this.subscriptionViewChanged = this._viewService.sendViewAction(this.view);             
        // On met à jour la BDD pour associer le event.dragData au post
        this.subscriptionUpdate = this._elementService.updateElement(this.element)
                                .subscribe(data => {
                                    console.log(data); });
        // On toaste pour l'utilisateur en cours
        this._translate.get('TOASTER.ELEMENT.UPDATE.SUCCESS').subscribe((res: string) => {
            console.log(res);
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