
/* https://ryanchenkie.com/angular-authentication-using-route-guards */

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate 
{
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean 
  {
    if (!this.authService.isLoggedIn()) 
    {
      console.log('pas loggé ça dégae !'); 
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

}