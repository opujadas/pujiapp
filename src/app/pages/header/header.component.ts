import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../guard/auth.service';
import { Router } from "@angular/router";
import {MatSidenavModule} from '@angular/material/sidenav';
import { Socket } from 'ng-socket-io';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userSigne : string; 
    nombreUtilisateursConnectes : number; 

  constructor(private authService: AuthService, private router: Router, private socket: Socket) { }

  ngOnInit() {
  		this.userSigne = localStorage.getItem('userId');

      this.socket.on('getNbUsers', function (data) {
        // this.toastr.success(data, 'Success!');
        console.log('Un nouvel user vient de se connecter : ' + data); 
        this.nombreUtilisateursConnectes = data; 
      }.bind(this));


  }



    isLoggedIn() {
        this.userSigne = localStorage.getItem('username');        
        return this.authService.isLoggedIn();
    }

    onLogout() {
        console.log('on logge out' + this.userSigne); 
        this.socket.emit("user_logout", this.userSigne);          
        this.authService.logout();

//         this.socket.emit("disconnect");
        this.router.navigate(['/home']);

    }

}
