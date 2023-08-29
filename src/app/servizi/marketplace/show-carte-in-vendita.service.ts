import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShowCarteInVenditaService {
  private baseUrl = 'http://localhost:9091/api/v1/marketplace';
  private baseUrl2 = 'http://localhost:9092/api/v1/cartemazzi';
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
    return this.http.get(url,httpOptions);
  }
  getCarteInVenditaBrano() {
    const url = `${this.baseUrl}/show-carteinvenditaBrano`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Imposta l'origine consentita, potrebbe essere più restrittivo
      })
    };
    return this.http.get(url,httpOptions);
  }

  getCarteArtistaByNickname(nick:string):Observable<Object>{
    const url = `${this.baseUrl2}/showCardArtistaUtente`;
    return this.http.post(url,nick);
  }
  getCarteBranoByNickname(nick:string):Observable<Object>{
    const url = `${this.baseUrl2}/showCardArtistaBrani`;
    return this.http.post(url,nick);
  }
}


