import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../modelli/user.model";
import {
  Nickname_and_email_user_loggedService
} from "../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signUpURL = '/api/v1/authenticationService/registration' //url del microservizio per la registrazione (in proxy.conf.json c'è la prima parte: http://localhost:8081)
  //signInURL = '/api/loginRegistered/{nickname}/{password}'
  signUPGoogleURL: string = '/api/v1/authenticationService/loginGoogle'
  signInURL = '/api/v1/authenticationService/loginRegistered/' //url per il login di un utente già registrato
  getEmailURL: string = '/api/v1/authenticationService/getEmail/'
  getNicknameURL : string = '/api/v1/authenticationService/getNickname/'
  getNickURL : string = '/api/v1/authenticationService/getNick'
  getPointsURL : string = '/api/v1/authenticationService/getPoints/'
  updatePointsURL: string = '/api/v1/authenticationService/updatePoints/'

  isLoggedIn = true // solo se questa variabile sarà true allora l'auth.guard
  // mi permettera di andare nella dashboard altrimenti siccome vuol dire che l'utente non è loggato verrà sempre rimandato sulla
  // pagina di login dell'applicazione (vedi aut.guard.ts)

  // @ts-ignore
  //user: User

  constructor(private http: HttpClient,private nick:Nickname_and_email_user_loggedService) {}


  // createUser(nickname: string, email: string, token: string, expirationDate: Date){
  //   this.user = new User(nickname, email, token, expirationDate);
  // }

  signUp(itemData: any): Observable<any>{
    return this.http.post(this.signUpURL, itemData, {responseType: 'text'}); // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  signUpGoogle(): Observable<any>{
    return this.http.get(this.signUPGoogleURL, {responseType: 'text'}); // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  signIn(nickname: string, password:string){
    return this.http.get(`${this.signInURL}`+`${nickname}`+`/`+`${password}`, {responseType: 'text'}) // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  getEmail(nickname: string) {
    return this.http.get(`${this.getEmailURL}`+`${nickname}`, {responseType: 'text'}) // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  getNickname(email: string) {
    return this.http.get(`${this.getNicknameURL}`+`${email}`, {responseType: 'text'}) // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }
  getActualNick() {
    return this.http.get(`${this.getNickURL}`,this.nick.getStoredNickname_user_logged()) // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }
  getPoints(nickname: String){
    return this.http.get(`${this.getPointsURL}`+`${nickname}`) // restituisce un intero
  }

  //
  updatePoints(nickname: String, new_points: number){
    return this.http.put(`${this.updatePointsURL}`+`${nickname}`+`/`+`${new_points}`, {responseType: 'text'}) // restituisce un intero
  }



  logout(){
    this.isLoggedIn = false; // lo setto a false in modo tale che l'utente che ha fatto il logout non potrà più entrare nella dashboard
    // Adesso ripulisco il local storage:
    localStorage.removeItem('nickname_user_logged');
    localStorage.removeItem('email_user_logged');
  }

}
