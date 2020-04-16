import { Component } from '@angular/core';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core'; 
import { Socket } from 'ng-socket-io';
import { WebsocketmessageService } from './core/socket/websocketmessage.service'; 
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
  '../../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css']

})
export class AppComponent {
  title = 'app';



  	constructor(
          public toastr: ToastsManager, 
          vcr: ViewContainerRef, /* private socket: Socket, */ 
          private _websocketmessageService : WebsocketmessageService,
          private _translate: TranslateService)
  	{
  		this.toastr.setRootViewContainerRef(vcr);
  		//this.toastr.success('Les toaster fonctionnent !', 'Success !'); 

        // this language will be used as a fallback when a translation isn't found in the current language
        _translate.setDefaultLang('fr');
 
         // the lang to use, if the lang isn't available, it will use the current loader to get them
        _translate.use('fr');        
  	}

  ngOnInit() {

    this._websocketmessageService.messages.subscribe(msg => {
      console.log(msg);
    })

  }   

  sendMessage() {
    this._websocketmessageService.sendMsg("Test Message");
  }

}
