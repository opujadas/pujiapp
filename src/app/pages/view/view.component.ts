// Core components
import { Component, OnInit, OnDestroy, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AppRoutingModule } from '../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Plugins & modules 
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Custom models
import { MessageSocket } from './../../core/model/message-socket/message-socket.model';
import { Element } from './../../core/model/element/element.model';
import { Tag } from './../../core/model/tag/tag.model';
import { Post } from './../../core/model/post/post.model';
import { View } from './../../core/model/view/view.model';

// Custom services
import { ViewService } from './../../core/service/view.service';
import { DialogEditView } from './dialogs/dialog-edit-view.component';
import { DataService } from './../../core/data/data.service';
import { ElementListService } from './../../core/service/element-list.service';
import { ElementService } from './../../core/service/element.service';
import { TagListService } from './../../core/service/tag-list.service';

 
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit, OnDestroy {

  // Custom variables & attributes

  private view            : View = new View("-1", localStorage.getItem('user_id'), "-1", "0", [], []);
  private viewPreEdition  : View; 
  private id              : string; 
  private elements        : any[]; // Element[]; 
  addPostForm             : FormGroup; 
  private title           : string; 
  private content         : string; 
  post                    : Post; 
  private showAddElement  : boolean = false; 

  // Variables for plugins 
  
  public Editor = ClassicEditor;
  
  // Subscriptions (don't forget to unsubscribe !)
  
  private subscription :                Subscription; 
  private subscriptionView :            Subscription; 
  private subscriptionViewChanged :     Subscription; 
  private subscriptionElementDeleted :  Subscription; 
  private subscriptionViewTagsChanged : Subscription;
  private subscriptionElements :        Subscription;  
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastsManager,
    private socket: Socket,
    public dialog: MatDialog,
    private _slimLoadingBarService: SlimLoadingBarService, 
    private _viewService : ViewService,
    private _elementListService: ElementListService,  
    private _elementService: ElementService,             
    private _translate: TranslateService 
  ) { 
      this._slimLoadingBarService.start();
      this.addPostForm = new FormGroup({
        'title': new FormControl(), 
        'content': new FormControl(null, Validators.required)
      });
  }

  ngOnInit() {
    // On récupère l'ID passé en URL
    this.id = this.route.snapshot.url[0].path; 
    
    // On récupère les infos de la vue 
    this.subscription = this.route.params
      .subscribe(
        (params: Params) => {
            this.id = params['idview'];
            // Dans tous les cas on initialise le formulaire
            this.getCurrentViewInfo(); 
        });
 
    // On s'abonne, si jamais on a un element supprimé, on le supprime visuellement
    this.subscriptionElementDeleted = this._elementListService.getElementDeletedAction().subscribe(data => { 
      //  On supprime visuellement l'élément passé     
      (this.elements).splice((this.elements).findIndex(x => x._id == data._id), 1);
      // On toaste pour l'utilisateur en cours
      this._translate.get('TOASTER.ELEMENT.TRASH.SUCCESS').subscribe((res: string) => {
          this.toastr.success(res, 'Success!');
      });            
    });   

    // On s'abonne si jamais la vue a changé de tags, on doit raffraichir la liste des éléments (à vérifier)
    this.subscriptionViewTagsChanged = this._viewService.getViewTagsChanged().subscribe(data => { 
       console.log('Refresh de la liste des éléments'); 
        this.getCurrentViewElements();
    });   

    this._slimLoadingBarService.complete();
  }

  /**********************************************************************************************************
    Fonction getCurrentViewInfo() : permet de charger une vue & ses éléments
      => s'applique dès qu'on clique sur une nouvelle vue (basé sur l'URL) 
      => on charge les infos de la vue, on sauvegarde une copie de la vue (clone) 
         si jamais on fait des modifications dessus qu'on puisse revenir en arrière si on annule des modifs
  ***********************************************************************************************************/

  getCurrentViewInfo(){
    console.log('getCurrentViewInfo');
    this._slimLoadingBarService.start();
    this.subscriptionView = this._viewService.getView(this.id)
      .subscribe(data => {
          if ((data.data) && (data.data !== undefined)) {
            this.view = data.data;
            // On clone this.view dans backup : 
            this.viewPreEdition = JSON.parse(JSON.stringify(data.data));

            // On récupère les éléments de la vue actuelle
            this.getCurrentViewElements(); 

            // On informe le viewService de la vue actuelle 
            this.subscriptionViewChanged = this._viewService.setCurrentView(data.data);
          } 

          // this.toastr.success('Les sites sont chargés !', 'Success!');
          this._slimLoadingBarService.complete();  
        });            
  }

  /**********************************************************************************************************
    Fonction getCurrentViewElements() : les éléments de la vue en cours, d'après ses tags
  ***********************************************************************************************************/

  getCurrentViewElements(){
    console.log('getCurrentViewElements');
    this._slimLoadingBarService.start();
    this.subscriptionElements = this._elementService.getElementsWithTags(this.view.tags)
      .subscribe(data => {          
          if(data.data){
            this.elements = data.data;             
          } 
          this._slimLoadingBarService.complete();  
        });           
  }

  /**********************************************************************************************************
    Fonction onSubmit() : appelée lorsque l'on ajoute un nouvel élément (post pour le moment)
  ***********************************************************************************************************/

  onSubmit()  {
    this._slimLoadingBarService.start();

    this.title = this.addPostForm.value.title;
    this.content = this.addPostForm.value.content;

    // Elément posté // pour le moment un élément de type post 
    let post = new Post("-1", "-1", this.title, this.content);
    let element = new Element("-1", localStorage.getItem('user_id'), this.view['tags'], "post", post); // type = 1 pour les posts 
    
    return  this._elementService.addElement(element)
        .subscribe(data => {
          if ((data != undefined) && (data.data != undefined)) {
            console.log(data.data);  
            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.POST.ADD.SUCCESS').subscribe((res: string) => {
                console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.POST.ADD.EMIT.SUCCESS', {value: this.title}).subscribe((res: string) => {
                var messageSocket = new MessageSocket(res, 'success', element, 'add_post'); 
                this.socket.emit("message", messageSocket);
              });    

            // On ajoute l'élément à la liste en cours (vue root ou pas c'est pareil)
            this.elements.unshift(data.data); 

            // On vide le formulaire
            this.addPostForm.reset();             
          }
          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this._slimLoadingBarService.complete();              
          });     
  }


  changeStateShowAddElement(){
    console.log('This Add BEFORE : ');
    console.log(this.showAddElement);  
    this.showAddElement = !this.showAddElement;
    console.log('This Add AFTER : ');
    console.log(this.showAddElement);  
  }


  /**********************************************************************************************************
    Fonction editView() : permet de modifier une vue (appelle le dialogue d'édition de vue)
      => Si la vue a été modifiée, on sauvegarde
      => Sinon (annulation) on recharge le clone créé en début de component
  ***********************************************************************************************************/

  editView(view : View) : void {

    let dialogRef = this.dialog.open(DialogEditView, {
      width :            '80%',
      data :             this.view
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si on a validé une mise à jour, on a un result
      if (result !== undefined){
        // On doit raffraichir les vues root, on informe le viewService
        this.subscriptionViewChanged = this._viewService.sendViewAction(this.view);             
      } 
      // Si on a annulé l'édition, le result est undefined
      else {
          this.view = JSON.parse(JSON.stringify(this.viewPreEdition));

          // On toaste pour l'utilisateur en cours
          this._translate.get('TOASTER.VIEW.UPDATE.CANCEL').subscribe((res: string) => {
              this.toastr.info(res, 'Information');
          });                                            
      }
     }); 
  }


  /**********************************************************************************************************
    Fonction onNewView() : permet de rediriger pour créer une nouvelle vue
  ***********************************************************************************************************/

  onNewView() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  /**********************************************************************************************************
    Fonction ngOnDestroy() : permet d'annuler toutes les subscriptions
  ***********************************************************************************************************/

  ngOnDestroy() {

    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionView)
      this.subscriptionView.unsubscribe();     
    if (this.subscriptionViewChanged)
      this.subscriptionViewChanged.unsubscribe();
    if (this.subscriptionElementDeleted)
      this.subscriptionElementDeleted.unsubscribe();
    if (this.subscriptionViewTagsChanged)
      this.subscriptionViewTagsChanged.unsubscribe();
    if (this.subscriptionElements)
      this.subscriptionElements.unsubscribe();
  }  
}