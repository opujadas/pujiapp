import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './../../../core/data/data.service';
import { PostListService } from './../../../core/service/post-list.service';
import { PostListComponent } from './post-list/post-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Post } from './../../../core/model/post/post.model';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'ng-socket-io';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  private posts: Post[]; 

  constructor(private slimLoadingBarService: SlimLoadingBarService, 

              private router: Router,
              private route: ActivatedRoute,
               ) 
  { 
      // Démarrage de la barre de chargement 
      this.slimLoadingBarService.start();
  }



  ngOnInit() {

      // Fin de la barre de chargement 
      this.slimLoadingBarService.complete();
  }


  onNewPost() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }  
}
