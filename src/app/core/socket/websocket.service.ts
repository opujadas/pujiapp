import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
// import { environment } from '../environments/environment';
import { Socket } from 'ng-socket-io';

import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { MessageSocket } from '../model/message-socket/message-socket.model'; 


@Injectable()
export class WebsocketService {

  // Our socket connection
  // private socket;

  constructor(private socket: Socket, public toastr: ToastsManager) {
    console.log('On est dans le WebsocketService'); 
   }

  connect(): Rx.Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
//    this.socket = io(environment.ws_url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {

/*
        this.socket.on('message_add_post', function (data) {
          console.log('Je recois le message_add_post'); 
          this.toastr.info('Nouveau post créé par ' + data.user_id +  ': ' + data.title, 'Info !');
          // console.log('Nouveau post créé par un autre user');
          console.log(data);
          // On va afficher le nouveau message dans la liste des posts
          // this.refreshList(); 
        }.bind(this));


    this.socket.on('message_edit_post', function (data) {
      //console.log('Je recois le message_delete_post'); 
      this.toastr.info('Post édité par ' + data.user_id +  ': ' + data.title, 'Info !');
      // console.log('Nouveau post créé par un autre user');
      console.log(data);
      // On va afficher le nouveau message dans la liste des posts
      // this.refreshList(); 
    }.bind(this));  
*/
    this.socket.on('message_delete_post', function (data) {
      //console.log('Je recois le message_delete_post'); 
      this.toastr.info('Post supprimé par ' + data.user_id +  ': ' + data.title, 'Info !');
      // console.log('Nouveau post créé par un autre user');
      console.log(data);
      // On va afficher le nouveau message dans la liste des posts
      // this.refreshList(); 
    }.bind(this));  


    this.socket.on('message_new_category', function (data) {
      this.toastr.info('Nouvelle catégorie créé par ' + data.user_id +  ': ' + data.title, 'Info !');
    }.bind(this));




    this.socket.on('message_success', function (data) {
      this.toastr.success(data, 'Success !');
      console.log('NOUVEAU message reçu du serveur !');
      console.log(data);  
    }.bind(this));

    this.socket.on('message_info', function (data) {
      this.toastr.info(data, 'Success !');
      console.log('NOUVEAU message reçu du serveur !');
      console.log(data);  
    }.bind(this));

    this.socket.on('message_warning', function (data) {
      this.toastr.warning(data, 'Success !');
      console.log('NOUVEAU message reçu du serveur !');
      console.log(data);  
    }.bind(this));

    this.socket.on('message_user_login', function (data) {
      this.toastr.info(data, 'Nouvelle connexion');
      console.log(data);  
    }.bind(this));

    this.socket.on('message_user_logout', function (data) {
      this.toastr.info(data, 'Déconnexion');
      console.log(data);  
    }.bind(this));


    this.socket.on('message', function (data: MessageSocket) {

      console.log('NEW message reçu : '); 
      console.log(data);  

      if ((data.message.type) && (data.message.content))
      {       
        console.log('type et msg trouvé !'); 
        switch(data.message.type)
        {
          case 'success':
            this.toastr.success(data.message.content, 'Success !');
          break; 

          case 'info':
            this.toastr.info(data.message.content, 'Info !');
          break;           

          case 'warning':
            this.toastr.warning(data.message.content, 'Warning !');
          break;           
        }
      }
      else
      {
                console.log('MERDE type et msg trouvé !'); 

      }

//       this.toastr.info(data, 'Déconnexion');
      console.log(data);  
    }.bind(this));
/*
        this.socket.on('message', (data) => {
          console.log("Received message from Websocket Server")
          observer.next(data);
        });
*/

        return () => {
          this.socket.disconnect();
        }
    });
    
    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

}