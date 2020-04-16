import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// import { ContactListService } from '../contact/contact-list/contact-list.service';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { AuthService } from '../../guard/auth.service';
import { TranslateService } from 'ng2-translate';


// import { MdDialog } from '@angular/material';
import {Http} from '@angular/http';
import 'rxjs/Rx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit 
{ 
  /*****************************************
  *               Attributs
  *****************************************/
  http: any;

  contacts : any;  
  private subscription: Subscription;

  listeContacts : any;
  user : any; 

  // Constructeur 
  
  constructor(
    private slimLoadingBarService: SlimLoadingBarService,
    private authService : AuthService,
    private _translate: TranslateService
   ) 
  { 
    this.slimLoadingBarService.start();
  }


  /*****************************************
  *        Initialisation de la home
  *****************************************/

  ngOnInit() 
  {
    console.log('On est dans la home !'); 

    // On va voir si on est signé 
    /*
    if (this.authService.isLoggedIn())
    {
      console.log('On est signé !'); 
    }*/

    // Fin de chargement de la barre
    this.slimLoadingBarService.complete();
  }

}

