import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { TagListService } from './../../../core/service/tag-list.service';

import { TagService } from './../../../core/service/tag.service';
import { Tag } from './../../../core/model/tag/tag.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})

export class TagListComponent implements OnInit, OnDestroy {

  private tags : Tag[]; // any[]; // Tag[]; 
  private subscription: Subscription;
  private subscription2: Subscription;
  displayedColumns = ['_id', 'name', 'cat_name', 'preview', 'actions'];
  dataSource : any;
  tag : Tag; 

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private tagService: TagService,
              private tagListService: TagListService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private socket: Socket,
              public toastr: ToastsManager)  { 
    // Sur ajout d'un nouveau tag par un autre utilisateur, on raffraichit la liste des tags
    this.socket.on('message', function (data) {

      // Si on a un message avec une action addtag ou deletetag, on rafraichit la liste des tags 
      if ( (data.message.action === 'add_tag') || (data.message.action === 'edit_tag') || (data.message.action === 'delete_tag') )  {
        // console.log('On raffraichit la liste des tags !'); 
        this.refreshList(); 
      }    
    }.bind(this));
  }


  deleteTag(con: Tag) : void {

    // console.log('openDialog - Ouverture dialog'); 
    this.tag = con;
        
    let dialogRef = this.dialog.open(DialogSupprimerTag, {
      width: '40%',
      data: { tag: this.tag }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.refreshList(); 
    });
  }


  ngOnInit() { 

    // console.log('On est dans le tag list component, on va chopper la liste des tags'); 
    // initialement on charge la liste des tags
    this.refreshList(); 
  }

  refreshList()  {
    // console.log('refreshList'); 
    // initialement on charge la liste des tags
    this.subscription2 = this.tagListService.getTags()
      .subscribe((data : Tag[]) =>  {
          console.log(data); 
          
        // Dasn la réalité, ça ne renvoie pas une liste de tags (puisque c'est le résultat d'une jointure avec les catégories de tags)
          this.tags = data.data ? data.data : []; 
          console.log('Tags => ');
          console.log(this.tags);

          this.dataSource = new MatTableDataSource(Object.values(data.data));
      });    

  } 

  editTag(tagid: string)  {
    if (tagid) {
      console.log('tagid : ' + tagid); 
      // On redirige
      this.router.navigate([ '/tags/edit/' + tagid ])      ;
    }
  }

  ngOnDestroy() {
    if(this.subscription)
      this.subscription.unsubscribe();
    if(this.subscription2)
      this.subscription2.unsubscribe();
  }

}



@Component({
  selector: 'dialog-supprimer-tag',
  templateUrl: 'dialog-supprimer-tag.html',
})
export class DialogSupprimerTag implements OnDestroy  {


  private subscription: Subscription;
  param : any; // titre du tag à supprimer

  constructor(
    public dialogRef: MatDialogRef<DialogSupprimerTag>,
    private tagService: TagService, 
    public toastr: ToastsManager, 
    private socket: Socket,
    private _translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

    console.log('suppression tag'); 
    console.log(data); 
    // On injecte le titre du tag pour pouvoir l'inclure dans la boite de dialogue et pouvoir faire la traduction
    this.param = {value : data.tag.name}; 
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du tag
  deleteTagConfirm(tag)  {
    console.log('Suppression du tag : '); 
    console.log(tag._id); 

    this.subscription = this.tagService.deleteTag(tag._id)
      .subscribe(data => {
            // On toaste pour l'utilisateur en cours
            this._translate.get('TOASTER.TAG.DELETE.SUCCESS').subscribe((res: string) => {
                // console.log(res);
                this.toastr.success(res, 'Success!');
            });            

            // On envoie un message pour les autres utilisateurs connectés
            this._translate.get('TOASTER.TAG.DELETE.EMIT.SUCCESS', {value: tag.name}).subscribe((res: string) => {
                // console.log(res);
                var messageSocket = new MessageSocket(res, 'info', tag, 'delete_tag'); 
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