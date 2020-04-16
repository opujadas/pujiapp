import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { CategoryListService } from './../../../core/service/category-list.service';
import { CategoryService } from './../../../core/service/category.service';
import { Category } from './../../../core/model/category/category.model';
import { MessageSocket } from './../../../core/model/message-socket/message-socket.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Socket } from 'ng-socket-io';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
 

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})

export class CategoryListComponent implements OnInit, OnDestroy {

  // Variables / attributs... 
  private categories = {}; // any[]; // Category[]; 
  private subscription: Subscription;
  private subscription2: Subscription;
  displayedColumns = ['_id', 'name', 'color', 'actions'];
  dataSource : any;
  category : Category; 

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private _categoryService: CategoryService,
              private _categoryListService: CategoryListService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private socket: Socket,
              public toastr: ToastsManager)  { 
    	console.log('On est dans le category list component, on va chopper la liste des categorys'); 

    	// initialement on charge la liste des categorys
      this.refreshList(); 

      // Sur ajout d'un nouveau post par un autre utilisateur, on raffraichit la liste des posts
      this.socket.on('message', function (data) {
        // Si on a un message avec une action addpost ou deletepost, on rafraichit la liste des posts 
        console.log('Message reçu : ');
        console.log(data); 
        if ( (data.message.action === 'add_category') || (data.message.action === 'edit_category')  || (data.message.action === 'delete_category')  ) {
          console.log('On raffraichit la liste des catégories !'); 
          this.refreshList(); 
        }    
      }.bind(this));

/*
    this.socket.on('message_add_category', function (data) {
      console.log('Je recois le message_add_category'); 
      this.toastr.info('Nouveau category créé par ' + data.user_id +  ': ' + data.title, 'Info !');
      // console.log('Nouveau category créé par un autre user');
      console.log(data);
      // On va afficher le nouveau message dans la liste des categorys
      this.refreshList(); 
    }.bind(this));


    this.socket.on('message_delete_category', function (data) {
      //console.log('Je recois le message_delete_category'); 
      this.toastr.info('Category supprimé par ' + data.user_id +  ': ' + data.title, 'Info !');
      // console.log('Nouveau category créé par un autre user');
      console.log(data);
      // On va afficher le nouveau message dans la liste des categorys
      this.refreshList(); 
    }.bind(this));  
    */
  }


  deleteCategory(con: Category) : void {
    console.log('openDialog - Ouverture dialog'); 
    console.log(con); 
    this.category = con; 
    
    let dialogRef = this.dialog.open(DialogSupprimerCategory, {
      width: '40%',
      data: { category: this.category }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('XX The dialog was closed');
      this.refreshList(); 
    });
  }


  ngOnInit() { 

    this.refreshList(); 
/*
        this.subscription = this._categoryService.currentCategoryChanged
          .subscribe(data => 
          {
            console.log('ON est dans category list component, on a capté que currentCategoryChanged ! '); 
            console.log(data);   

            console.log('On raffrichit la liste des categorys'); 
            this.refreshList(); 
          });
*/

  }

  refreshList()  {
    console.log('refreshList'); 
    // initialement on charge la liste des categorys
    this.subscription2 = this._categoryListService.getCategories()
      .subscribe(data => {
          console.log(data);
          if (data.data){
            console.log(data.data);
            this.categories = data.data; 
            this.dataSource = new MatTableDataSource(Object.values(data.data));
          } 
      });    
  }



  editCategory(category: Category)  {
    console.log('On va éditer le category : ');
    console.log(category);
    if (category._id)  {
          console.log('On va éditer le category : ' + category._id);
          // On redirige
          this.router.navigate([ '/categories/edit/' + category._id ])      ;
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
  selector: 'dialog-supprimer-category',
  templateUrl: 'dialog-supprimer-category.html',
})
export class DialogSupprimerCategory implements OnDestroy  {


  private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogSupprimerCategory>,
    private _categoryService: CategoryService, 
    private socket: Socket, 
    public toastr: ToastsManager,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log('Ouverture dialog'); 
  }



  onNoClick(): void {
    this.dialogRef.close();
  }

  // Fonction appelée après confirmation de suppression du category
  deleteCategoryConfirm(category: Category)
  {
    console.log('deleteCategoryConfirm'); 
    console.log(category); 
    // Envoyer fonction pour supprimer le category de la BDD
    // Envoyer fonction pour supprimer le contact de la BDD
    this.subscription = this._categoryService.deleteCategory(category._id)
      .subscribe(data => {
          // On toaste pour l'utilisateur en cours
          this.toastr.success('La catégorie a bien été supprimée', 'Success!');

          // On envoie un message pour les autres utilisateurs connectés
          var messageSocket = new MessageSocket(
              'Un utilisateur vient de supprimer la catégorie : ' + category.name,
              'info',
              category,
              'delete_category'
            ); 

          this.socket.emit("message", messageSocket);     
      });   

    // Supprimer le category de la liste actuelle des categorys 

    // Faire action puis fermer la fenêtre
    this.dialogRef.close();
  }


ngOnDestroy() {
  if (this.subscription)
    this.subscription.unsubscribe();
}

}