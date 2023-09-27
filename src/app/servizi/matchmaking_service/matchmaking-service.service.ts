import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MatchmakingServiceService {

  constructor(private http: HttpClient) { }

  getAllPartiteSenzaMatchURL: string = '/api/v1/matchmakingService/matchmakingController/getAllPartiteSenzaMatch'
  putCercaMatchURL: string = '/api/v1/matchmakingService/matchmakingController/CercaMatch'
  postCreaNuovaPartitaURL: string = '/api/v1/matchmakingService/matchmakingController/CreaNuovaPartita'
  deleteCancellaPartitaURL: string = '/api/v1/matchmakingService/matchmakingController/CancellaPartita/'

  getAllPartiteConcluseURL: string = '/api/v1/matchmakingService/riepilogoPartitaConclusaController/getAllPartiteConcluse/'

  getAllPartiteSenzaMatch(nickname: String) {
    return this.http.get<any>(`${this.getAllPartiteSenzaMatchURL}`) // riceverà una lista di oggetti della classe Matchmaking in formato JSON
  }

  // prende in input un oggetto "Giocatore" e restituisce una stringa
  putCercaMatch(itemData: any): Observable<any>{
    return this.http.put(this.putCercaMatchURL, itemData, {responseType: 'text'});
  }

  // prende in input un oggetto "Matchmaking" e restituisce una stringa
  postCreaNuovaPartita(itemData: any): Observable<any>{
    return this.http.post(this.postCreaNuovaPartitaURL, itemData, {responseType: 'text'});
  }

  deleteCancellaPartita(id_partita: any): Observable<any>{
    return this.http.delete(`${this.deleteCancellaPartitaURL}`+`${id_partita}`, {responseType: 'text'});
  }


  getAllPartiteConcluse(nickname: string): Observable<any>{
    return this.http.get(`${this.getAllPartiteConcluseURL}`+`${nickname}`);
  }

}
