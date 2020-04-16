import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
// import {Headers} from '@angular/http';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from './../core/model/user/user.model';
import {ServicesEndPoints} from "../core/service-end-points";

import { DataService } from '../core/data/data.service';

import 'rxjs/Rx';

@Injectable()

export class AuthService {

  public token: string;

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


  constructor(
      private http: Http, 
      public toastr: ToastsManager,
      private _dataService: DataService) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;      
  }


  getCurrentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));    
  }

  /* Fonction login : va envoyer les paramètres du formulaire au back-end nodeJS pour vérification 
      => backend va authentifier le user, créer le JWT, on va faire du localstorage dans le navigateur
            
  */
    login(user: User) {
      console.log('login !'); 
      return this._dataService.login(user);
    }  



  /* Fonction login : va envoyer les paramètres du formulaire au back-end nodeJS pour vérification 
      => backend va authentifier le user, créer le JWT, on va faire du localstorage dans le navigateur
            
  */
    signup(user: User) {
      console.log('signup !'); 
      return this._dataService.signup(user);
    }  



  activate(user, key) {

    let obj = {
      "user": user,
      "key": key
    }; 
    console.log('Data activate '); 
    console.log(obj); 

    return this._dataService.activate(obj);
  }


    /* Fonction logout : pour se délogger */
    logout() {
        localStorage.clear();
    }

    /* Fonction isLoggedIn : pour se délogger */
    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }  
}