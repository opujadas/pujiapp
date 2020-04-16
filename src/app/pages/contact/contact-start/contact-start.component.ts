import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; 
import { DataService } from '../../../core/data/data.service';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Contact } from './../../../core/model/contact/contact.model';
import { AppRoutingModule } from '../../../app-routing.module';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-contact-start',
  templateUrl: './contact-start.component.html',
  styleUrls: ['./contact-start.component.css']
})


export class ContactStartComponent implements OnInit {

	
  	constructor() {

      // Démarrage de la barre de chargement 
      // this.slimLoadingBarService.start(() => { console.log('Début de la loading bar'); });

  	 }

	ngOnInit() 
	{

      // Fin de la barre de chargement 
      //this.slimLoadingBarService.complete();  
	}

}