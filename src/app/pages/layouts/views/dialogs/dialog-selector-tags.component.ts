
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


import { MessageSocket } from './../../../../core/model/message-socket/message-socket.model';
import { TagListService } from './../../../../core/service/tag-list.service';
import { ViewService } from './../../../../core/service/view.service';
import { ElementService } from './../../../../core/service/element.service';
import { ElementListService } from './../../../../core/service/element-list.service';

import { Tag } from './../../../../core/model/tag/tag.model';
import { View } from './../../../../core/model/view/view.model';


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