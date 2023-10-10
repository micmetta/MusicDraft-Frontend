import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShowCarteInVenditaService {

  private baseUrl = '/api/v1/marketplace';
  private baseUrl2 = '/api/v1/cartemazzi';
  private baseUrl3: string = '/api/v1/artistController';
  private baseUrl4: string = '/api/v1/trackController';

  http:HttpClient;


  constructor( http:HttpClient) {

    this.http=http;
  }

  getCarteInVenditaArtista() {
    const url = `${this.baseUrl}/show-carteinvenditaArtista`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };
    return this.http.get(url);
  }
  getCarteInVenditaBrano() {
    const url = `${this.baseUrl}/show-carteinvenditaBrano`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };
    return this.http.get(url);
  }

  getCarteArtistaByNickname(nick:string){
    const url = `${this.baseUrl2}/showCardArtistaUtente/${nick}`;
    console.log(url)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };
//
    return this.http.get(url);
  }
  getCarteBranoByNickname(nick:string){
    const url = `${this.baseUrl2}/showCardArtistaBrani/${nick}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };
    return this.http.get(url);
  }


  // QUI DEVI AGGIUNGERE I METODI PER PRENDERE LE CARTE DALLA TABELLE "artisti" e "brani" CHE CONTERRANNO SEMPRE TUTTE LE CARTE DEL SISTEMA !!!!

  getAllArtisti(){
    const url = `${this.baseUrl3}/show-artist`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };

    return this.http.get(url);
  }

  getAllBrani(){
    const url = `${this.baseUrl4}/show-track`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };

    return this.http.get(url);
  }


}


