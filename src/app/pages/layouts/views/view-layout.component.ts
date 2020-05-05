// Core components
import { Component, Input, OnInit, OnDestroy, ViewChild, Inject, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms'; 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs';

// Plugins & modules
import { Socket } from 'ng-socket-io';
import { TranslateService } from 'ng2-translate';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

// Custom models
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { TagListService } from './../../../core/service/tag-list.service';
import { ViewService } from './../../../core/service/view.service';
import { ElementService } from './../../../core/service/element.service';
import { ElementListService } from './../../../core/service/element-list.service';

// Custom services
import { Tag } from './../../../core/model/tag/tag.model';
import { View } from './../../../core/model/view/view.model';

// Custom interface
interface CustomNode {
  name: string;
  children?: CustomNode[];
}


@Component({
  selector: 'app-view-layout',
  templateUrl: './view-layout.component.html',
  styleUrls: ['./view-layout.component.css']
})

export class ViewLayoutComponent implements OnInit, OnDestroy {

  // Custom variables & attributes
  private id : string; 
  private view : View; 
  private tags: Tag[]; 
  private rootViews : any[] = []; 
  private showDialogTags : boolean = false; 
  private showDialogTrash : boolean = false; 
  rootViewHasChanged : Subscription; 
  rootview : string;

  // Variables for plugins 
  treeControl = new NestedTreeControl<View>(node => node.children);
  dataSource = new MatTreeNestedDataSource<View>();

  // Subscriptions (don't forget to unsubscribe !)
  private subscriptionGetTags: Subscription;
  private subscriptionGetViews: Subscription;
  private subscriptionGetChildrenViews: Subscription;
  private subscription: Subscription; 
  private subscriptionRecycleBin: Subscription; 
  private subscriptionElementDeleted: Subscription; 
  private subscriptionGetCurrentView: Subscription;


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


  ngOnInit() { 
    // initialement on charge la liste des tags
    this.refreshTagList();
    this.refreshRootViewList(); 
  }

  /**********************************************************************************************************
    Fonction hasChild() : fonction pour le mattree => j'imagine que ça checke si le neoud a des fils ou pas 
  ***********************************************************************************************************/

  hasChild = (_: number, node: CustomNode) => !!node.children && node.children.length > 0;

  /**********************************************************************************************************
   Fonction addViewAction() 
   !! A voir si c'est vraiment une fonction utile, on si on peut taper directement le refreshlist
  ***********************************************************************************************************/

    addViewAction(){
      console.log('Call du addViewAction'); 
      this.refreshRootViewList();
    }


  /**********************************************************************************************************
   Fonction addChildView(view) 
      => fonction qui permet d'ouvrir une boite dialogue pour créer une sous-vue
  ***********************************************************************************************************/

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

  /**********************************************************************************************************
   Fonction moveToRecycleBin(event) 
      => fonction appelée lorsqu'un element est DnD vers la poubelle
  ***********************************************************************************************************/

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
                      // On envoie la nouvelle valeur au service 
                      this._elementListService.deleteElementListAction(event.dragData);
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

  /**********************************************************************************************************
   Fonction refreshTagList() 
      => fonction qui permet de raffraichir la liste des tags (appelé lors du chargement de la page)
  ***********************************************************************************************************/

  refreshTagList()  {
    // initialement on charge la liste des tags
    this.subscriptionGetTags = this._tagListService.getTags()
      .subscribe(data =>  {
          if(data.data){
            this.tags = data.data; 
          }
      });    
  } 

  /**********************************************************************************************************
   Fonction refreshRootViewList() 
      => fonction qui permet de récupérer toutes les vues pour créer le Mat Tree des vues 
      (alimentation de la dataSource du mattree)
  ***********************************************************************************************************/

  refreshRootViewList(){
    this.subscriptionGetViews = this._viewService.getViews(localStorage.getItem('rootview')).subscribe(data =>  {
         if (data.data){
          this.rootViews = data.data; 
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