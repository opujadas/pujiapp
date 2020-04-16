import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './../../core/data/data.service';
import { TagListService } from './../../core/service/tag-list.service';
import { TagListComponent } from './tag-list/tag-list.component';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Tag } from './../../core/model/tag/tag.model';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'ng-socket-io';



@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit, OnDestroy {

  private tags: Tag[]; 

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


  onNewTag() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }  
}
