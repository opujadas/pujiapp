import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
// import { DataService } from '../../../../core/data/data.service';
import { ElementService } from '../../../../core/service/element.service';
import { TagService } from '../../../../core/service/tag.service';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import { Element } from './../../../../core/model/element/element.model';
import { Post } from './../../../../core/model/post/post.model';
import { Tag } from './../../../../core/model/tag/tag.model';

import { MessageSocket } from './../../../../core/model/message-socket/message-socket.model';

import { AppRoutingModule } from '../../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.css']
})


export class PostAddComponent implements OnInit, OnDestroy  {

  addPostForm: FormGroup; 

  private title : string; 
  private content : string; 
  private subscription: Subscription;
  private selectableTags: any; 
  private selectedTags = []; 

    constructor(
      private slimLoadingBarService: SlimLoadingBarService, 
      public toastr: ToastsManager, 
      vcr: ViewContainerRef, 
      private router: Router, 
      private socket: Socket,
      private _elementService : ElementService, 
      private _tagService: TagService,
      private _translate: TranslateService) {
     }

  ngOnInit()  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();
    
    this.addPostForm = new FormGroup({
      'title': new FormControl(null, Validators.required), 
      'content': new FormControl(null, Validators.required)
    });
    

    // On charge les tags 
    this.subscription = this._tagService.getTags()
      .subscribe(data => {
        console.log('tags récupérés ');
        console.log(data);  
        if (data.data){        
            this.selectableTags = data.data; 
            this.toastr.success('Les tags sont chargés !', 'Success!');
            this.slimLoadingBarService.complete();  
        }
    });


    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }

  addTag(tag, index) {

    console.log('Tag to add  : '); 
    console.log(tag); 
    // ' => on ajoute aux trucs selectionnés !');

    this.selectableTags.splice(index, 1);
    this.selectedTags.push(tag);

    console.log('Selectable tags : '); 
    console.log(this.selectableTags); 

    console.log('Selected tags : '); 
    console.log(this.selectedTags); 
  }


  deleteTagAffectation(tag, index) {
    console.log('On supprime l affectation');
    console.log(index); 
    this.selectableTags.push(tag);
    this.selectedTags.splice(index, 1);
  }

  onSubmit()  {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();

    this.title = this.addPostForm.value.title;
    this.content = this.addPostForm.value.content;

/*    console.log("selectedTags"); 
    console.log(this.selectedTags); 

    for(var i=0; i<this.selectedTags.length; i++) {
      console.log(this.selectedTags[i]); 
      // (id : number = -1, name: string, category: Category)
      // var tag = new Tag(this.selectedTags[], name: string, category: Category); 
    }
*/


// On construit 
// constructor(id : number = -1, element_id : number = -1, title: string, content: string) {

    
    let post = new Post(-1, -1, this.title, this.content);       /*,1 ,      this.selectedTags */    
    console.log('Post : '); 
    console.log(post); 

    //constructor(id : number = -1, user_id: number = 1, tags : Tag[], type, data : {}) {
    let element = new Element(-1, 9999, this.selectedTags, "post", post); // type = 1 pour les posts 
    console.log('Element'); 
    console.log(element); 

    return  this._elementService.addElement(element)
        .subscribe(data => {
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
          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/posts' ])
          });     
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}