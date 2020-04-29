import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DataService } from './../../core/data/data.service';
import { ElementListService } from './../../core/service/element-list.service';
import { ElementService } from './../../core/service/element.service';
import { TagListService } from './../../core/service/tag-list.service';
//import { viewListComponent } from './view-list/view-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Element } from './../../core/model/element/element.model';
import { Tag } from './../../core/model/tag/tag.model';
import { Post } from './../../core/model/post/post.model';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { FormGroup, FormControl } from '@angular/forms'; 
import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';


import { View } from './../../core/model/view/view.model';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'ng-socket-io';
import { AppRoutingModule } from '../../app-routing.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ViewService } from './../../core/service/view.service';

import { TranslateService } from 'ng2-translate';
import { MessageSocket } from './../../core/model/message-socket/message-socket.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DialogEditView } from './dialogs/dialog-edit-view.component';

 
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {


    public Editor = ClassicEditor;

  //private views: view[]; 
  private subscription : Subscription; 
  private subscriptionView : Subscription; 
  private subscriptionViewChanged : Subscription; 
  private subscriptionElementDeleted : Subscription; 
  private subscriptionViewTagsChanged : Subscription;
  private subscriptionElements : Subscription;  

  //   constructor(id : number = -1, name: string = "", user_id: number = -1, parent_id : number = 0, tags : Tag[]) {

  private view : View = new View(-1, localStorage.getItem('user_id'), -1, 0, [], []);
  private id : string; 
  private elements : any[]; // Element[]; 
  addPostForm: FormGroup; 

private title : string; 
  private content : string; 
    post : Post; 

  constructor(private slimLoadingBarService: SlimLoadingBarService, 
              private router: Router,
              private route: ActivatedRoute,
              private _viewService : ViewService,
              private _elementListService: ElementListService,  
              private _elementService: ElementService,             
              private _translate: TranslateService,
               public toastr: ToastsManager,
                             private socket: Socket,

                   public dialog: MatDialog

              ) { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start();

    this.addPostForm = new FormGroup({
      'title': new FormControl(), 
      'content': new FormControl(null, Validators.required)
    });

  }

  ngOnInit() {
    console.log(this.route.snapshot); 
    this.id = this.route.snapshot.url[0].path; 
    
    console.log('ID view compo : ' + this.id); 

    this.subscription = this.route.params
      .subscribe(
        (params: Params) => {
            console.log(params);             
            this.id = params['idview'];
            // Dans tous les cas on initialise le formulaire
            console.log('Initialisation du form'); 
            this.getCurrentViewInfo(); 
        });


    this.subscriptionElementDeleted = this._elementListService.getElementDeletedAction().subscribe(data => { 
      //  On supprime visuellement l'élément passé     
      console.log('On supprime '); 
      console.log(data); 
      console.log('Dans la liste :  '); 
    console.log(this.elements); 
      

      (this.elements).splice((this.elements).findIndex(x => x._id == data._id), 1);
      // On toaste pour l'utilisateur en cours
      this._translate.get('TOASTER.ELEMENT.TRASH.SUCCESS').subscribe((res: string) => {
          console.log(res);
          this.toastr.success(res, 'Success!');
      });            
    });   



    this.subscriptionViewTagsChanged = this._viewService.getViewTagsChanged().subscribe(data => { 
       console.log('Refresh de la liste des éléments'); 
        this.getCurrentViewElements();
    });   


    this.slimLoadingBarService.complete();
  }


  getCurrentViewInfo(){
    console.log('getCurrentViewInfo');
    this.subscriptionView = this._viewService.getView(this.id)
      .subscribe(data => {
          console.log(data);
          if ((data.data) && (data.data !== undefined)) {
            this.view = data.data;

            // On choppe les id tags de la vue actuelle
            // console.log(); 
            // this.elements = data.data.elements; 

            console.log('On choppe les elements'); 
            this.getCurrentViewElements(); 


            console.log('INFO au service que la vue a changé'); 
            this.subscriptionViewChanged = this._viewService.setCurrentView(data.data);             
          } 

          // this.toastr.success('Les sites sont chargés !', 'Success!');
          this.slimLoadingBarService.complete();  
        });            
  }

  getCurrentViewElements(){
    console.log('getCurrentViewElements');

    var vuetagsID = this.view.tags; 

/*    console.log('creation tableau de tags');
    var vuetagsID = []; 
    for(var i=0; i<this.view.tags.length; i++){
        vuetagsID[i] = this.view.tags;
    }

    console.log('view.tags : '); 
    console.log(vuetagsID); 
*/
    this.subscriptionElements = this._elementService.getElementsWithTags(vuetagsID)
      .subscribe(data => {
          
          if(data.data){
            console.log(data.data);
            this.elements = data.data; 
            console.log(this.elements); 
            this.slimLoadingBarService.complete();  
          } 

        });           
  }




  onSubmit()  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();

    this.title = this.addPostForm.value.title;
    this.content = this.addPostForm.value.content;

    // On construit 
    // constructor(id : number = -1, element_id : number = -1, title: string, content: string) {

    
    let post = new Post(-1, -1, this.title, this.content);       /*,1 ,      this.selectedTags */    
    console.log('Post : '); 
    console.log(post); 

    //constructor(id : number = -1, user_id: number = 1, tags : Tag[], type, data : {}) {
    let element = new Element(-1, localStorage.getItem('user_id'), this.view['tags'], "post", post); // type = 1 pour les posts 
    console.log('Element'); 
    console.log(element); 

    return  this._elementService.addElement(element)
        .subscribe(data => {
          if ((data != undefined) && (data.data != undefined)) {
            console.log('retous du addElement');
            console.log(data.data);  

            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.POST.ADD.SUCCESS').subscribe((res: string) => {
                console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.POST.ADD.EMIT.SUCCESS', {value: this.title}).subscribe((res: string) => {
                console.log(res);
                var messageSocket = new MessageSocket(res, 'success', element, 'add_post'); 
                this.socket.emit("message", messageSocket);
              });    

            // On ajoute l'élément à la liste en cours (vue root ou pas c'est pareil)
            this.elements.unshift(data.data); 

            console.log(this.elements); 

            // On vide le formulaire
            this.addPostForm.reset();             
          }
          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            // this.router.navigate([ '/views/elements' ])
          });     
  }




  editView(view : View) : void {

    console.log('On ouvre une fenetre dialogue pour affichier / editer la vue'); 
         
    let dialogRef = this.dialog.open(DialogEditView, {
      width: '80%',
      data: this.view
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
      // this.refreshList(); 

    // On met à jour la BDD pour associer le event.dragData au View
/*
    this.subscriptionUpdate = this._viewService.updateView(this.view)
                            .subscribe(data => {
                                console.log(data);
                                // this.dialogRef.close();
      });       
    });
    */
     }); 
  }

  onNewView() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  ngOnDestroy() {

    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionView)
      this.subscriptionView.unsubscribe();     
    if (this.subscriptionElementDeleted)
      this.subscriptionElementDeleted.unsubscribe();  
    if (this.subscriptionViewTagsChanged)
      this.subscriptionViewTagsChanged.unsubscribe();  
  }  
}





