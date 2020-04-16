import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng6-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from './../../../core/model/user/user.model';
import { AuthService } from '../../../guard/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})

export class UserSignupComponent implements OnInit {
  
  myForm: FormGroup;

	constructor( public toastr: ToastsManager, 
               private _authService: AuthService, 
               private router: Router,
               private activatedRoute: ActivatedRoute) { 
	}

	ngOnInit() {

    if (this.activatedRoute.snapshot.url[0].path === "activate"){
      // subscribe to router event
      this.activatedRoute.queryParams.subscribe((params: Params) => {
          console.log(params); 
          let user = params['user'];
          console.log(user);
          let authKey = params['authKey'];
          console.log(authKey);        
       
          if (user && authKey){
            console.log('Activation du compte ? '); 
            // On va essayer d'activer le compte
            this._authService.activate(user, authKey)
                .subscribe(data => {
                      console.log('Activation'); 
                      console.log(data); 
                      this.toastr.success('Votre compte (' + user + ') est bien activé ! ', 'Success!');
                      this.router.navigateByUrl('/user/login');              
                    },
                    error => console.error(error)
                );
          }
        });
    }

		 this.myForm = new FormGroup({
          login: new FormControl(null, Validators.required),            
          password: new FormControl(null, Validators.required),
          passwordConfirm: new FormControl('', Validators.required),
          email: new FormControl(null, Validators.email)},
          this.passwordMatchValidator);    
	}

  passwordMatchValidator(g: FormGroup) {
     return g.get('password').value === g.get('passwordConfirm').value
        ? null : {'mismatch': true};
  }

  onSubmit() {
    const user = new User(
        this.myForm.value.login,
        this.myForm.value.email,
        this.myForm.value.password
         );

    this._authService.signup(user)
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
              }              
            }
            },
            error => console.error(error)
        );

  //  this.myForm.reset();    
  }
}
