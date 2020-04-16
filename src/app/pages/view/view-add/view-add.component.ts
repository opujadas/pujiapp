import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
// import { DataService } from '../../../../core/data/data.service';
//import { ElementService } from '../../../../core/service/element.service';
import { TagService } from '../../../core/service/tag.service';
import { ViewService } from '../../../core/service/view.service';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

//import { Element } from './../../../../core/model/element/element.model';
//import { View } from './../../../../core/model/View/View.model';
import { Tag } from './../../../core/model/tag/tag.model';
import { View } from './../../../core/model/view/view.model';

import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Socket } from 'ng-socket-io';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-view-add',
  templateUrl: './view-add.component.html',
  styleUrls: ['./view-add.component.css']
})


export class ViewAddComponent implements OnInit, OnDestroy  {

  addViewForm: FormGroup; 

  private name : string; 
  
  //private content : string; 
  private subscription: Subscription;
  private selectableTags: any; 
  private selectedTags = []; 

  @Output() 
  addViewAction : EventEmitter<View> = new EventEmitter<View>();

    constructor(
      private slimLoadingBarService: SlimLoadingBarService, 
      public toastr: ToastsManager, 
      vcr: ViewContainerRef, 
      private router: Router, 
      private socket: Socket,
      private _tagService: TagService,
      private _viewService: ViewService,
      private _translate: TranslateService) {

     }

  ngOnInit() {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();
    
    this.addViewForm = new FormGroup({
      'name': new FormControl(null, Validators.required)
      /*, 
      'content': new FormControl(null, Validators.required) */
    });
    

    // On charge les tags 
    this.subscription = this._tagService.getTags()
      .subscribe(data => {
        console.log('tags récupérés ');
        console.log(data);  
          this.selectableTags = data; 
          this.toastr.success('Les tags sont chargés !', 'Success!');
          this.slimLoadingBarService.complete();  
    });


    // Fin de la barre de chargement 
    this.slimLoadingBarService.complete();
  }

  addToTags(dData, index) {

    console.log('dragData');
    console.log(dData.dragData);
     
    let tag: Tag = dData.dragData; 
    //tag = dragData[0].dragData; 

    console.log('Tag to add  : '); 
    console.log(tag); 
    // ' => on ajoute aux trucs selectionnés !');

    this.selectableTags.splice(index, 1);

      if ((this.selectedTags).findIndex(x => x.id == tag.id) == -1)
        this.selectedTags.push(tag);

    console.log('Selectable tags : '); 
    console.log(this.selectableTags); 

    console.log('Selected tags : '); 
    console.log(this.selectedTags); 
  }


  deleteTag(tag, index) {
    console.log('On supprime l affectation');
    console.log(index);

    this.selectableTags.push(tag);
    this.selectedTags.splice(index, 1);
  }

  onSubmit() {
    // Démarrage de la barre de chargement 
    this.slimLoadingBarService.start();

    this.name = this.addViewForm.value.name;
//    this.content = this.addViewForm.value.content;

    console.log("selectedTags"); 
    console.log(this.selectedTags); 

    for(var i=0; i<this.selectedTags.length; i++) {
      console.log(this.selectedTags[i]); 
      // (id : number = -1, name: string, category: Category)
      // var tag = new Tag(this.selectedTags[], name: string, category: Category); 
    }


// On construit 
// constructor(id : number = -1, element_id : number = -1, name: string, content: string) {

    
    //let view = new view(-1, -1, this.name, this.content);       /*,1 ,      this.selectedTags */    
    console.log('view : '); 
    //console.log(view); 

  // constructor(id : number = -1, name: string = "", user_id: number = -1, parent_id : number = 0, tags : Tag[]) {
    let view = new View(-1, this.name, -1, 0, this.selectedTags, []); // type = 1 pour les Views 
    console.log(view); 

    return  this._viewService.addView(view)
        .subscribe(
          data => {
            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.VIEW.ADD.SUCCESS').subscribe((res: string) => {
                console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.VIEW.ADD.EMIT.SUCCESS', {value: this.name}).subscribe((res: string) => {
                console.log(res);
                var messageSocket = new MessageSocket(res, 'success', view, 'add_view'); 
                this.socket.emit("message", messageSocket);
              });    

            // On émet l'évenement à notre EventEmitter pour informer la vue mère que la liste doit se raffraichir
            //this.addViewAction.emit(view);


            // On envoie la nouvelle valeur au service 
            this._viewService.sendViewAction(view);

          },
          error => console.log("Error: ", error),
          () => {
            // Fin de la barre de chargement 
            this.slimLoadingBarService.complete();              
            this.router.navigate([ '/views/elements' ])
          });     
  
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}