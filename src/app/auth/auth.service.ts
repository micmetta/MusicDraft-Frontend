import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signUpURL = '/api/registration' //url del microservizio per la registrazione (in proxy.conf.json c'è la prima parte: http://localhost:8081)
  //signInURL = '/api/loginRegistered/{nickname}/{password}'
  signUPGoogleURL: string = '/api/loginGoogle'
  signInURL = '/api/loginRegistered/' //url per il login di un utente già registrato


  isLoggedIn = true // solo se questa variabile sarà true allora l'auth.guard
  // mi permettera di andare nella dashboard


  constructor(private http: HttpClient) {}

  signUp(itemData: any): Observable<any>{
    return this.http.post(this.signUpURL, itemData, {responseType: 'text'}); // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  signUpGoogle(): Observable<any>{
    return this.http.get(this.signUPGoogleURL, {responseType: 'text'}); // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  signIn(nickname: string, password:string){
    return this.http.get(`${this.signInURL}`+`${nickname}`+`/`+`${password}`, {responseType: 'text'}) // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }



}
