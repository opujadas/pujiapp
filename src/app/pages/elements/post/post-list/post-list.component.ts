import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
// import { PostListService } from './../../../../core/service/post-list.service';
// import { PostService } from './../../../../core/service/post.service';
import { ElementService } from './../../../../core/service/element.service';
import { Post } from './../../../../core/model/post/post.model';

import { MessageSocket } from './../../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
      
      simpleDrop: any = null;

  private posts = []; // any[]; // Post[]; 
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscriptionTag: Subscription;

  displayedColumns = ['id', 'title', 'content', 'created', 'user_id', 'tags', 'actions'];
  dataSource : any;
  post : Post; 

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(/*private postService: PostService,
              private postListService: PostListService,*/
              private _elementService : ElementService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private socket: Socket,
              public toastr: ToastsManager)  { 

    // Sur ajout d'un nouveau post par un autre utilisateur, on raffraichit la liste des posts
    this.socket.on('message', function (data) {

      // Si on a un message avec une action addpost ou deletepost, on rafraichit la liste des posts 
      if ( (data.message.action === 'add_post') || (data.message.action === 'delete_post') ) {
        // console.log('On raffraichit la liste des posts !'); 
        this.refreshList(); 
      }
    }.bind(this));
  }


    addToTags(event){
      console.log('Ajouter aux tags');
      console.log(event); 
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

    // console.log('On est dans le post list component, on va chopper la liste des posts'); 
    // initialement on charge la liste des posts
    this.refreshList(); 
  }

  refreshList() {
    // console.log('refreshList'); 
    // initialement on charge la liste des posts
    this.subscription2 = this._elementService.getElementsByType('post')
      .subscribe(data => {
          
          console.log(data); 
          if(data.data){
            console.log(data.data); 
            var donnees = Object.values(data.data); 
            console.log(donnees);         
            this.dataSource = new MatTableDataSource(donnees);
          }
/*          for(var i=0; i<donnees.length; i++){
            

            console.log('On récupère les tags associés à ' + donnees[i]['id'] + ' soit element_id : ' + donnees[i]['element_id']); 
            console.log(donnees[i]); 


            this.subscriptionTag = this._elementService.getElementTags(donnees[i]['element_id'])
              .subscribe(elementtags => {

            this.posts[i] = {
              post : donnees[i],
              tags : Object.values(elementtags)
            }; 
            console.log(this.posts); 
              });
          } 
*/
          
      });    
  }

  editPost(post: Post) {
    console.log('edit post'); 
    console.log(post); 
    if (post._id) {
      // On redirige
      this.router.navigate([ '/posts/edit/' + post._id ]);
    }
  }


  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
    if(this.subscription2)
      this.subscription2.unsubscribe();
    if (this.subscriptionTag)
      this.subscriptionTag.unsubscribe(); 
  }
}



@Component({
  selector: 'dialog-supprimer-post',
  templateUrl: 'dialog-supprimer-post.html',
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
  deletePostConfirm(post: Post){
    console.log(post); 
    this.subscription = this._elementService.deleteElement(post._id)
      .subscribe(data => {
        // On toaste pour l'utilisateur en cours
        this._translate.get('TOASTER.POST.DELETE.SUCCESS').subscribe((res: string) => {
            // console.log(res);
            this.toastr.success(res, 'Success!');
        });            

        // On envoie un message pour les autres utilisateurs connectés
        this._translate.get('TOASTER.POST.DELETE.EMIT.SUCCESS', {value: post.title}).subscribe((res: string) => {
            // console.log(res);
            var messageSocket = new MessageSocket(res, 'info', post, 'delete_post'); 
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