import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
// import { ElementListService } from './../../../../core/service/element-list.service';
// import { elementservice } from './../../../../core/service/post.service';
import { ElementService } from './../../../core/service/element.service';
import { Post } from './../../../core/model/post/post.model';
import { Element } from './../../../core/model/element/element.model';
import { ElementListService } from './../../../core/service/element-list.service';

import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms'; 

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Component({
  selector: 'app-element-list',
  templateUrl: './element-list.component.html',
  styleUrls: ['./element-list.component.css']
})

export class ElementListComponent implements OnInit, OnDestroy 
{
  private elements = []; // any[]; // Post[]; 
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscriptionTag: Subscription;
  private subscriptionElementDeleted : Subscription;
  private title : string; 
  private content : string; 
  private selectableTags: any; 
  private selectedTags = []; 

  dataSource : any;
  post : Post; 
    addPostForm: FormGroup; 

      // on s'abonne au service

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(/*private elementservice: elementservice,
              private ElementListService: ElementListService,*/
              private _elementService : ElementService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private socket: Socket,
              public toastr: ToastsManager,
              private slimLoadingBarService: SlimLoadingBarService,
              private _translate: TranslateService,
              private _elementListService: ElementListService
              ) { 
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();
    
    this.addPostForm = new FormGroup({
      'title': new FormControl(), 
      'content': new FormControl(null, Validators.required)
    });


    this.subscriptionElementDeleted = this._elementListService.getElementDeletedAction().subscribe(data => { 
      
      //  On supprime visuellement l'élément passé     
      (this.elements).splice((this.elements).findIndex(x => x.id == data.id), 1);

      // On toaste pour l'utilisateur en cours
      this._translate.get('TOASTER.ELEMENT.TRASH.SUCCESS').subscribe((res: string) => {
          console.log(res);
          this.toastr.success(res, 'Success!');
      });            

      // console.log('Action efectuée sur une vue root, on refresh la liste !');  
      // this.refreshRootViewList();
    });   


    // Sur ajout d'un nouveau post par un autre utilisateur, on raffraichit la liste des elements
    this.socket.on('message', function (data) {

      // Si on a un message avec une action addpost ou deletepost, on rafraichit la liste des elements 
      if ( (data.message.action === 'add_element') || (data.message.action === 'delete_element') )
      {
        // console.log('On raffraichit la liste des elements !'); 
        this.refreshList(); 
      }
    
    }.bind(this));

    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();    
  }


  deletePost(con: Post) : void {

    // console.log('openDialog - Ouverture dialog'); 
    this.post = con;
        
    let dialogRef = this.dialog.open(DialogSupprimerPost, {
      width: '40%',
      data: { post: this.post }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.refreshList(); 
    });
  }


  ngOnInit() { 

    // console.log('On est dans le post list component, on va chopper la liste des elements'); 
    // initialement on charge la liste des elements
    this.refreshList(); 
  }

  refreshList() {
    // console.log('refreshList'); 
    // initialement on charge la liste des elements



    this.subscription2 = this._elementService.getElements()
      .subscribe(data => {
          
          console.log(data); 
          var donnees = Object.values(data); 
          this.elements = donnees; 

      }); 


/*    this.subscription2 = this._elementService.getElements()
      .subscribe(data => {
          
          console.log(data); 
          var donnees = Object.values(data); 
          this.elements = donnees; 
        }); 
/*          for(var i=0; i<donnees.length; i++){
            

            console.log('On récupère les tags associés à ' + donnees[i]['id'] + ' soit element_id : ' + donnees[i]['element_id']); 
            console.log(donnees[i]); 


            this.subscriptionTag = this._elementService.getElementTags(donnees[i]['element_id'])
              .subscribe(elementtags => {

            this.elements[i] = {
              post : donnees[i],
              tags : Object.values(elementtags)
            }; 
            console.log(this.elements); 
              });
          } 
         // this.dataSource = new MatTableDataSource(donnees);
      });    
*/
  }

  editPost(post: Post) {
    if (post.id) {
      // On redirige
      this.router.navigate([ '/elements/edit/' + post.id ]);
    }
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
    let element = new Element(-1, 9999, this.selectedTags, 1, post); // type = 1 pour les posts 
    console.log('Element'); 
    console.log(element); 

    return  this._elementService.addElement(element)
        .subscribe(data => {
            console.log('retous du addElement');
            console.log(data);  

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
            this.elements.unshift(data); 

            console.log(this.elements); 

            // On vide le formulaire
            this.addPostForm.reset(); 
          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/views/elements' ])
          });     
  }





ngOnDestroy() {
  if(this.subscription)
    this.subscription.unsubscribe();
  if(this.subscription2)
    this.subscription2.unsubscribe();
  if (this.subscriptionTag)
    this.subscriptionTag.unsubscribe();
  if (this.subscriptionElementDeleted)
    this.subscriptionElementDeleted.unsubscribe();

  
}

}



@Component({
  selector: 'dialog-delete-element',
  templateUrl: 'dialog-delete-element.html',
})
export class DialogSupprimerPost implements OnDestroy  {


  private subscription: Subscription;
  param : any; // titre du post à supprimer

  constructor(
    public dialogRef: MatDialogRef<DialogSupprimerPost>,
    private _elementService : ElementService,  
    public toastr: ToastsManager, 
    private socket: Socket,
    private _translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    // On injecte le titre du post pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    this.param = {value : data.post.title}; 
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du post
  deletePostConfirm(post: Post)
  {
    this.subscription = this._elementService.deleteElement(post.element_id)
      .subscribe(data => {
        // On toaste pour l'utilisateur en cours
        this._translate.get('TOASTER.POST.DELETE.SUCCESS').subscribe((res: string) => {
            // console.log(res);
            this.toastr.success(res, 'Success!');
        });            

        // On envoie un message pour les autres utilisateurs connectés
        this._translate.get('TOASTER.POST.DELETE.EMIT.SUCCESS', {value: post.title}).subscribe((res: string) => {
            // console.log(res);
            var messageSocket = new MessageSocket(res, 'info', post, 'delete_element'); 
            this.socket.emit("message", messageSocket);
        }); 
    });   

    // Fermeture de la fenêtre
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();

  }

}