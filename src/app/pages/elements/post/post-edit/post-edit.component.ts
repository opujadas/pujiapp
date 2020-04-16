import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Element } from './../../../../core/model/element/element.model';
import { Post } from './../../../../core/model/post/post.model';
import { Tag } from './../../../../core/model/tag/tag.model';

import { MessageSocket } from './../../../../core/model/message-socket/message-socket.model';
import { PostService } from './../../../../core/service/post.service';
import { ElementService } from './../../../../core/service/element.service';
import { TagService } from './../../../../core/service/tag.service';

import { AppRoutingModule } from '../../../../app-routing.module';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})


export class PostEditComponent implements OnInit, OnDestroy  {

  private id: string;
  private element_id: string;

  editPostForm: FormGroup; 
  private title : string; 
  private content : string; 

  subscription : Subscription; 
  subscription2 : Subscription; 
  subscription3 : Subscription; 
  subscription4 : Subscription; 
  subscriptionElement : Subscription; 
  
  private selectableTags: any; 
  private selectedTags : Tag[]; 

  constructor(
    private slimLoadingBarService: SlimLoadingBarService, 
    public toastr: ToastsManager, 
    private router: Router, 
    private route: ActivatedRoute,
    // private _dataService: DataService,
    // private _postService : PostService,
    private _tagService : TagService,
    private _elementService : ElementService, 
    private socket: Socket) {
   }

  ngOnInit() 
  {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

      // On charge les tags 
      this.subscription = this._tagService.getTags()
        .subscribe(data => {
          
          console.log(data);  
          if (data.data){
            console.log('tags récupérés ');
            console.log(data.data);  
            this.selectableTags = data.data; 
            //this.toastr.success('Les tags sont chargés !', 'Success!');
          }
         this.slimLoadingBarService.complete();  
      });
      
      this.subscription2 = this.route.params
        .subscribe(
          (params: Params) => {
            console.log(params); 
              this.id = params['id'];
        
              // this.subscription2 = this._elementService.getElement(this.element_id)
              this.subscription2 = this._elementService.getElement(this.id)
                .subscribe(res => {
                    console.log('message : '); 
                    console.log(res);
                    if (res.data){
                      console.log('MSG OK'); 
                      var datalight = res.data; 
                      console.log('data tronqué'); 
                      console.log(datalight);
                      if (datalight.type){
                        console.log('data type : '); 
                        console.log(datalight.type); 
                        if (datalight.type === "post"){
                          console.log('on est dans un post');
                          // this.element_id = data['element_id']; 
                          if (datalight.data){
                            var datapost = datalight.data; 
                            console.log('infos post'); 


                                this.title = datapost['title']; 
                                this.content = datapost['content']; 

                              }
                            }
                            else {
                              console.log('dada not defined'); 
                            }
                      }
                         console.log('Actual data : '); 
                          console.log(datalight); 
                          console.log(datapost); 
                          // Maintenant on va en déduire des tags selectable !                    
                          this.selectedTags = datalight.tags; 

                          console.log('selected tags : '); 
                          console.log(this.selectedTags); 
      
                          console.log('selectable tags : '); 
                          console.log(this.selectableTags);
                          for (var i=0; i<this.selectedTags.length; i++){
                            (this.selectableTags).splice((this.selectableTags).findIndex(x => x._id == this.selectedTags[i]['_id']), 1);
                          }
                    } 
                }); 
            }); 


      this.editPostForm = new FormGroup({
        'title': new FormControl(null, Validators.required), 
        'content': new FormControl(null, Validators.required)
      });
    
      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();
  }


  addTag(tag, index) {

    console.log('Add tag to element !!'); 
    console.log(tag._id); 
    console.log('On ajoute ' + tag._id + ' au element ' + this.id); 
    // On met à jour la BDD pour associer le tag au post
    this.subscription3 = this._elementService.addTagToElement(tag._id, this.id)
                            .subscribe(data => {
                                console.log('message : '); 
                            }); 

    
    // On modifie les listes
    this.selectableTags.splice(index, 1);
    this.selectedTags.push(tag);
  }


  deleteTagAffectation(tag, index) {
    console.log('On supprimer ' + tag._id + ' du element ' + this.id); 
    // On met à jour la BDD pour associer le tag au post
    this.subscription4 = this._elementService.deleteTagFromElement(tag._id, this.id)
                            .subscribe(data => {
                                console.log('message : '); 
                            }); 


    // On modifie les listes
    this.selectableTags.push(tag);
    this.selectedTags.splice(index, 1);
  }


  onSubmit()  {
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

    console.log(this.editPostForm); 
    console.log('Title saisi : ' + this.editPostForm.value.title);
    console.log('Title saisi : ' + this.editPostForm.value.content);
  
    this.title = this.editPostForm.value.title;
    this.content = this.editPostForm.value.content;

/*
    let post = new Post(
      this.id,
      this.title,
      this.content,                
      1,
      this.selectedTags
    );   
*/
    let post = new Post(this.id, this.id, this.title, this.content);       /*,1 ,      this.selectedTags */    
    console.log('Post : '); 
    console.log(post); 

    //constructor(id : number = -1, user_id: number = 1, tags : Tag[], data : {}) {
    let element = new Element(this.id, 9999, this.selectedTags, "post", post); 
    console.log('Element'); 
    console.log(element); 
    console.log(post); 

    // return this._dataService.editPost(post)
    return this._elementService.editElement(element)
        .subscribe(data => {
            // On toaste
            this.toastr.success('Le post a bien été modifié !', 'Success!');

            // On envoie un message pour les autres utilisateurs connectés
            var messageSocket = new MessageSocket(
                'Le post ' + this.title + ' vient d\'être édité par XXX',
                'success',
                post
              ); 

            this.socket.emit("message", messageSocket);              
          },
          error => console.log("Error: ", error),
          () => 
          {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/posts' ])
          });     
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    if (this.subscription3)
       this.subscription3.unsubscribe();
    if (this.subscription4)
       this.subscription4.unsubscribe();
    if (this.subscriptionElement)
       this.subscriptionElement.unsubscribe();
  }  
}
