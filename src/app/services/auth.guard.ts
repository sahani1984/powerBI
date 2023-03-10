import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,
         CanActivate,
         Router,
         RouterStateSnapshot,
         UrlTree
       } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authServices:AuthService, private router:Router ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authServices.getUserLogged()){
          this.router.navigate(['/login']);
      }
      return this.authServices.getUserLogged();     
  }
  
}
