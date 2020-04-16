import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
// import { MessageService } from '../message.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from './../../../core/model/user/user.model';
import { AuthService } from '../../../guard/auth.service';
import { Router } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit {
  myForm: FormGroup;

	constructor(public toastr: ToastsManager, private _authService: AuthService, private router: Router, private socket: Socket, private _translateService: TranslateService) { 
	}

	ngOnInit() {
		 this.myForm = new FormGroup({
          login: new FormControl(null, Validators.required),            
          password: new FormControl(null, Validators.required)
      });    
	}


  onSubmit()  {
    const user = new User(this.myForm.value.login, '', this.myForm.value.password);

    this._authService.login(user)
        .subscribe(data => {

            console.log('user signup'); 
            console.log(data); 
            if (data.status){
              if (data.status === "error"){
                var message = data.message ? data.message : "Erreur";
                  this.toastr.error(message, 'Erreur !');

              }
              if (data.status === "success"){
                var message = data.message ? data.message : "Success";
                  this.toastr.success(message, 'Success !');

                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.userid);
                localStorage.setItem('username', data.username);
                localStorage.setItem('user', data.user);

                // Envoi d'un message aux users
                //console.log('on logge in ' + data.username); 
                this.socket.emit("user_login", data.username);                        
                this.router.navigateByUrl('/posts');                     
              }              
            }
            },
            error => {
              console.error(error);              
              var message = error.statusText ? error.statusText : "Erreur";

              this.toastr.error(message, 'Erreur !');

            }
        


             /* this._translateService.get('TOASTER.LOGIN.SUCCESS').subscribe((res: string) => {
                  this.toastr.success(res, 'Success!');
              });                           
              */
           
        ); 
  }
}
