import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Nickname_and_email_user_loggedService {

  public nickname_user_logged = new Subject<String>();
  public email_user_logged = new Subject<String>();
  nickname_user_logged$ = this.nickname_user_logged.asObservable();
  email_user_logged$ = this.email_user_logged.asObservable();

  constructor() { }

  updateNickname_user_logged(newValue: String){
    this.nickname_user_logged.next(newValue);
    localStorage.setItem('nickname_user_logged', JSON.stringify(newValue));
  }

  updateEmail_user_logged(newValue: String){
    this.email_user_logged.next(newValue);
    localStorage.setItem('email_user_logged', JSON.stringify(newValue));
  }

  getStoredNickname_user_logged(): any {
    const storedValue = localStorage.getItem('nickname_user_logged');
    return storedValue ? JSON.parse(storedValue) : null;
  }

  getStoredEmail_user_logged(): any {
    const storedValue = localStorage.getItem('email_user_logged');
    return storedValue ? JSON.parse(storedValue) : null;
  }

}
