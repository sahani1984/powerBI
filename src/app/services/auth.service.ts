import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLoggedIn: boolean = false;
  userRegisterIn: boolean = false;
  USER_INFO: any;
  constructor() {
    this.USER_INFO = JSON.parse(sessionStorage.getItem('user_info') || '{}');
    if (this.USER_INFO.hasOwnProperty('_token')) {
      this.userLoggedIn = true;
      this.userRegisterIn = true;
    }
  }

  getUserLogged() {
    return this.userLoggedIn;
  }

  setUserLoggedIn() {
    this.userLoggedIn = true;
  }


}
