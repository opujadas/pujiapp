

import { Component, Input, OnInit, OnDestroy, ViewChild, Inject, Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

import { FormGroup, FormControl } from '@angular/forms'; 
import {FlatTreeControl} from '@angular/cdk/tree';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';


import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';


import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { TagListService } from './../../../core/service/tag-list.service';
import { ViewService } from './../../../core/service/view.service';
import { ElementService } from './../../../core/service/element.service';
import { ElementListService } from './../../../core/service/element-list.service';

import { Tag } from './../../../core/model/tag/tag.model';
import { View } from './../../../core/model/view/view.model';



interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];


@Component({
  selector: 'app-view-layout',
  templateUrl: './view-layout.component.html',
  styleUrls: ['./view-layout.component.css']
})

export class ViewLayoutComponent implements OnInit, OnDestroy {

  private subscriptionGetTags: Subscription;
  private subscriptionGetViews: Subscription;
  private subscriptionGetChildrenViews: Subscription;
  private subscription: Subscription; 
  private subscriptionRecycleBin: Subscription; 
  private subscriptionElementDeleted: Subscription; 
  private subscriptionGetCurrentView: Subscription;
  

  private id : string; 
  private view : View; 

  private tags: Tag[]; 
  private rootViews : any[] = []; 

  private showDialogTags : boolean = false; 
  private showDialogTrash : boolean = false; 

  rootViewHasChanged : Subscription; 
  rootview : string;

/*
treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
*/

treeControl = new NestedTreeControl<View>(node => node.children);
  dataSource = new MatTreeNestedDataSource<View>();



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private socket: Socket,
    public toastr: ToastsManager,
    private _tagListService : TagListService,
    private _viewService : ViewService,
    private _elementService : ElementService,
    private _elementListService : ElementListService
    ){ 

    this.rootview = localStorage.getItem('rootview');

    this.subscriptionGetCurrentView = this._viewService.getCurrentViewChanged().subscribe(data => { 
      this.view = data;
    }); 

    this.subscriptionGetViews = this._viewService.getViews(localStorage.getItem('rootview')).subscribe(data =>  {
         if (data.data){
          this.rootViews = data.data; 
          this.dataSource.data = data.data;     
         }
      });


    this.rootViewHasChanged = this._viewService.getViewAction().subscribe(data => {
      console.log('Actions sur vue => affecte le root tree : on refresh !'); 
      console.log(data); 
      this.refreshRootViewList(); 
  }); 
        

/*
    this.subscriptionElementDeleted = this._elementListService.getElementDeletedAction().subscribe(data => { 
      
      //  On supprime visuellement l'élément passé     
      console.log('Elements : '); 
      console.log(this.view.elements); 
      console.log('Il faut supprimer : '); 
      console.log(data); 

      console.log('data._id'); 
      console.log(data._id); 

      (this.elements).splice((this.elements).findIndex(x => x._id == data._id), 1);

      // On toaste pour l'utilisateur en cours
      this._translate.get('TOASTER.ELEMENT.TRASH.SUCCESS').subscribe((res: string) => {
          console.log(res);
          this.toastr.success(res, 'Success!');
      });
      
      });             
*/

  }


  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  /* Fonction addViewAction(event) 
      => event : View => correspond au numéro du tag à supprimer
      But : raffraichir la liste des vues qd on en ajoute une 
      Pour le moent on fait juste un refresh de la liste, à terme pour optimiser, on ajoutera juste 
      la nouvelle vue passée en paramètre
  */

    addViewAction(){
      console.log('Call du addViewAction'); 
      this.refreshRootViewList();
    }


  ngOnInit() { 
    // initialement on charge la liste des tags
    this.refreshTagList();
    this.refreshRootViewList(); 
  }


  showChildren(view : View) : void {

    console.log('On affiche les vues enfants !'); 
    //console.log(view); 
    console.log('On charge les enfant de la vue  ! ' + view.id); 

    this.subscriptionGetChildrenViews = this._viewService.getViews(view.id).subscribe((data : View[]) =>  {
         console.log('yihaaa');  
         view.children = data;
         console.log(view); 
      });  


  }



  addChildView(view : View) : void {

    console.log('On ouvre une fenetre dialogue pour créer une sous-vue'); 
    console.log(view); 
    let dialogRef = this.dialog.open(DialogAddChildView, {
      width: '80%',
      data: view
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('ici The dialog was closed');
     }); 
  }


moveToRecycleBin(event){
  console.log('Un élémént à recycler !'); 
  console.log(event); 

  // Ici on va devoir regarder quel est la nature de l'élément à supprimer ? 
  if(event){
    if ((event.dragData) && (event.dragData.ref)){
      switch(event.dragData.ref){
        case 'tag':
            console.log('On delete un tag'); 
        break;

        case 'element':
            console.log('On delete un élément');
            this.subscriptionRecycleBin = this._elementService.moveToRecycleBin(event.dragData)
                                .subscribe(data => {
                                    console.log(data); 

                                    console.log('On va supprimer visuellement élément de la vue');
                                    console.log(event.dragData._id); 
                                    console.log('à supprimer de : ');
                                    

                                    // On envoie la nouvelle valeur au service 
                                    this._elementListService.deleteElementListAction(event.dragData);
                                    // this.elements.tags.splice( ((this.elements.tags).findIndex(x => x._id == event)), 1); 
                                });             
        break; 

        case 'view':
            console.log('On delete une view');
        break;



        default:
        console.log('Autre chose à supprimer !'); 
      }
    }
  }
}


  refreshTagList()  {
    // console.log('refreshTagList'); 
    // initialement on charge la liste des tags
    this.subscriptionGetTags = this._tagListService.getTags()
      .subscribe(data =>  {
          if(data.data){
          // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
            this.tags = data.data; 
            console.log('Tags => ');
            console.log(this.tags);            
          }
      });    
  } 

  refreshRootViewList(){
    this.subscriptionGetViews = this._viewService.getViews(localStorage.getItem('rootview')).subscribe(data =>  {
         console.log('Recup des filles');  
         console.log(data); 
         if (data.data){
          this.rootViews = data.data; 
          console.log('this rootViews'); 
          console.log(this.rootViews); 
          this.dataSource.data = data.data;     
         }
      });  

  }

  showDialogSelectorTags() : void {       
    this.showDialogTags = true; 
  }

  hideDialogSelectorTags() : void {       
    this.showDialogTags = false; 
  }

  showTrash() : void {       
    this.showDialogTrash = true; 
  }

  hideTrash() : void {       
    this.showDialogTrash = false; 
  }

  ngOnDestroy() {
    if (this.subscriptionGetTags)
      this.subscriptionGetTags.unsubscribe();
    if (this.subscriptionGetViews)
      this.subscriptionGetViews.unsubscribe();
    if (this.subscriptionRecycleBin)
      this.subscriptionRecycleBin.unsubscribe();


  }

}


/*
@Component({
  selector: 'dialog-add-child-view',
  templateUrl: 'dialog-add-child-view.html',
  styleUrls: ['./view-layout.component.css']
})
export class DialogAddChildView implements OnDestroy  {

  addChildViewForm: FormGroup; 

  private subscription: Subscription;
  private subscriptionUpdate: Subscription;
  private subscriptionGetTags: Subscription;
  private subscriptionAddTag: Subscription; 
  private subscriptionDeleteTag: Subscription; 
  private subscriptionView: Subscription; 
  // param : any; // titre du View à supprimer
  elementBackup : Element; 
  tags: Tag[]; 
  // let view = new View(-1, this.name, localStorage.getItem('user_id'), this.parent_id, this.selectedTags, []); // type = 1 pour les Views 
  private parentView : View = new View('-1', '', localStorage.getItem('user_id'), '0', [], []);
  private newView : View = new View('-1', '', localStorage.getItem('user_id'), '0', [], []);

  private childname : string = ''; 

  private fixedTags : any; 
  private selectableTags: any = []; 
  private selectedTags = []; 



  constructor(
    public dialogRef: MatDialogRef<DialogAddChildView>,
    private _viewService : ViewService,  
    private _tagListService : TagListService,
    public toastr: ToastsManager, 
    private socket: Socket,
    private router: Router,
    private _translate: TranslateService, 
    @Inject(MAT_DIALOG_DATA) public view: View) { 

    // if (element.data.title) this.oldtitle = element.data.title; 
    // if (element.data.content) this.oldcontent = element.data.content; 

    this.subscriptionView = this._viewService.getView(view._id)
      .subscribe(data => {
          console.log(data); 
          if (data.data){
            this.parentView = data.data;
            this.newView.parent_id = this.parentView._id; 
            console.log('new View : ');
            console.log(this.newView); 
            console.log('PARENT'); 
            console.log(this.parentView);             
          }
          //this.tags = data.tags; 
          // this.toastr.success('Les sites sont chargés !', 'Success!');
        });            

    // On injecte le titre du View pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    // this.element = element;
    console.log('Element depuis le dialogue :'); 





    this.addChildViewForm = new FormGroup({
      'childname': new FormControl(null, Validators.required)
    });

    this.subscriptionGetTags = this._tagListService.getTags()
      .subscribe(data =>  {
          if (data.data){          
          // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
            this.tags = data.data; 
            console.log('Tags => ');
            console.log(this.tags);

            // On va supprimer les tags de la vue mère qu'on ne puisse pas les sélectionner
            for(var i=0; i<this.parentView.tags.length; i++){
              console.log('On retire le tag ' + this.parentView.tags[i]['_id']);
              var index = (this.tags).findIndex(x => x._id == this.parentView.tags[i]['_id']);
              console.log(index); 
              
              this.tags.splice(index, 1);
            }
          }



      });    

  }

  onNoClick(): void {
    console.log('on no click'); 

    // On réassigne les anciennes valeurs
    // this.element.data.title = this.oldtitle; 
    // this.element.data.content = this.oldcontent; 

    this.dialogRef.close();
  }


  addToTags(dData) {

    console.log('dragData');
    console.log(dData.dragData);
     
    let tag: Tag = dData.dragData; 
    //tag = dragData[0].dragData; 

    console.log('Tag to add  : '); 
    console.log(tag); 
    // ' => on ajoute aux trucs selectionnés !');


      if ((this.selectedTags).findIndex(x => x.id == tag.id) == -1)
        this.selectedTags.push(tag);

      if ((this.tags).findIndex(x => x.id == tag.id) !== -1)
        this.tags.splice((this.tags).findIndex(x => x.id == tag.id), 1);
    

    console.log('Selectable tags : '); 
    console.log(this.tags); 

    console.log('Selected tags : '); 
    console.log(this.selectedTags); 
  }


  deleteTag(tag) {
    console.log('On supprime l affectation');
    
      if ((this.tags).findIndex(x => x.id == tag.id) == -1)
        this.tags.push(tag);

      if ((this.selectedTags).findIndex(x => x.id == tag.id) !== -1)
        this.selectedTags.splice((this.selectedTags).findIndex(x => x.id == tag.id), 1);

  }


  onSubmit() {
    // Démarrage de la barre de chargement 
   
    console.log('Submit new sous vue');
    console.log(this.newView);  
    // this.name = this.addViewForm.value.name;
//    this.content = this.addViewForm.value.content;

    console.log("selectedTags"); 
    console.log(this.selectedTags); 

    console.log("Parent tags"); 
    console.log(this.parentView.tags); 

    var newViewTags = (this.selectedTags).concat(this.parentView.tags);


    for(var i=0; i<newViewTags.length; i++) {
      console.log(newViewTags[i]); 
    }

    this.newView['tags'] = newViewTags; 
    console.log('New view');
    console.log(this.newView);  
    return  this._viewService.addView(this.newView)
        .subscribe(data => {

            console.log('After insert'); 
            console.log(data); 
            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.VIEW.ADD.SUCCESS').subscribe((res: string) => {
                console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.VIEW.ADD.EMIT.SUCCESS', {value: this.newView.name}).subscribe((res: string) => {
                console.log(res);
                var messageSocket = new MessageSocket(res, 'success', this.newView, 'add_view'); 
                this.socket.emit("message", messageSocket);
              });    

            // On émet l'évenement à notre EventEmitter pour informer la vue mère que la liste doit se raffraichir
            //this.addViewAction.emit(view);


            // On envoie la nouvelle valeur au service 
            this._viewService.sendViewAction(this.newView);


            this.dialogRef.close();


            // Redirection vers la nouvelle vue ou la vue parente si pb

          },
          error => console.log("Error: ", error),
          () => {
            console.log('Ici ? Wtf'); 
            // Fin de la barre de chargement 
            //this.slimLoadingBarService.complete();              
          });     
  
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
    if (this.subscriptionView)
      this.subscriptionView.unsubscribe(); 
  }

}


*/


@Component({
  selector: 'dialog-selector-tags',
  templateUrl: 'dialog-selector-tags.html',
})
export class DialogSelectorTags implements OnInit, OnDestroy  {

  private subscription: Subscription;
  param : any; // titre du post à supprimer
  private subscriptionGetTags: Subscription;
  private tags: Tag[]; 


  constructor(
    public dialogRef: MatDialogRef<DialogSelectorTags>,
    public toastr: ToastsManager, 
    private socket: Socket,
    private _translate: TranslateService,
    private _tagListService : TagListService,


    @Inject(MAT_DIALOG_DATA) public data: any) { 

    // On injecte le titre du post pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    // this.param = {value : data.post.title}; 
  }


  ngOnInit() { 

    // console.log('On est dans le tag list component, on va chopper la liste des tags'); 
    // initialement on charge la liste des tags
    this.refreshTagList(); 
  }

  refreshTagList()  {
    // console.log('refreshTagList'); 
    // initialement on charge la liste des tags
    this.subscriptionGetTags = this._tagListService.getTags()
      .subscribe((data : Tag[]) =>  {
          
        // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
          this.tags = data; 
          console.log('Tags => ');
          console.log(this.tags);
      });    
  } 

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fermeture de la fenêtre
  closeDialog()  {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}