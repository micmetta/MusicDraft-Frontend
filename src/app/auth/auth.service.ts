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
  getAllUsersURL: string = '/api/v1/authenticationService/getAllUsers'
  getIsOnlineURL: string = '/api/v1/authenticationService/getIsOnline/'
  setIsOnlineURL: string = '/api/v1/authenticationService/setIsOnline/'
  setIsOfflineURL: string = '/api/v1/authenticationService/setIsOffline/'

  getUserURL: string = '/api/v1/authenticationService/getUser/'
  getNumberUsersOnlineURL: string = '/api/v1/authenticationService/getNumberUsersOnline'
  putNewNicknameURL: string = '/api/v1/authenticationService/updateNickname/'
  putNewPasswordURL: string = '/api/v1/authenticationService/updatePassword/'


  isLoggedIn = true // solo se questa variabile sarà true allora l'auth.guard
  // mi permettera di andare nella dashboard altrimenti siccome vuol dire che l'utente non è loggato verrà sempre rimandato sulla
  // pagina di login dell'applicazione (vedi aut.guard.ts)


  constructor(private http: HttpClient, private nick:Nickname_and_email_user_loggedService) {}


  getUser(nickname: string){
    return this.http.get<any>(`${this.getUserURL}`+`${nickname}`) // restituisce un oggetto di tipo User oppure null
  }

  getNumberUsersOnline(){
    return this.http.get<any>(`${this.getNumberUsersOnlineURL}`) // restituisce un intero
  }

  putNewNickname(nicknameCurrent: string, nicknameNew: string){
    return this.http.put(`${this.putNewNicknameURL}`+`${nicknameCurrent}`+`/`+`${nicknameNew}`, null, {responseType: 'text'});
  }

  putNewPassword(nickname: string, passwordNew: string){
    return this.http.put(`${this.putNewPasswordURL}`+`${nickname}`+`/`+`${passwordNew}`, null, {responseType: 'text'});
  }

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

  getPoints(nickname: String){
    return this.http.get(`${this.getPointsURL}`+`${nickname}`) // restituisce un intero
  }

  //
  // updatePoints(nickname: String, new_points: number){
  //   return this.http.put(`${this.updatePointsURL}`+`${nickname}`+`/`+`${new_points}`, {responseType: 'text'}) // restituisce un intero
  // }

  getAllUsers(){
    return this.http.get<any>(`${this.getAllUsersURL}`) // restituisce una lista di oggetti di tipo User
  }

  getIsOnline(nickname: string){
    return this.http.get(`${this.getIsOnlineURL}`+`${nickname}`, {responseType: 'text'}) // restituisce una stringa
  }

  setIsOnline(nickname_user_logged: string){

    console.log("URL dentro setIsOnline: ", `${this.setIsOnlineURL}`+`${nickname_user_logged}`)
    return this.http.put(`${this.setIsOnlineURL}`+`${nickname_user_logged}`, null, {responseType: 'text'})
  }

  logout(nickname_user_logged: string){

    this.isLoggedIn = false; // lo setto a false in modo tale che l'utente che ha fatto il logout non potrà più entrare nella dashboard
    // Adesso ripulisco il local storage:
    localStorage.removeItem('nickname_user_logged');
    localStorage.removeItem('email_user_logged');
    // setto lo stato IsOffline a false per l'utente corrente:
    return this.http.put(`${this.setIsOfflineURL}`+`${nickname_user_logged}`, null, {responseType: 'text'})
  }

}
