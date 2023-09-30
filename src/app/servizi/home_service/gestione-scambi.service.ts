import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GestioneScambiService {


  postInviaRichiestaAmicoURL: string = '/api/v1/homeService/addAmico/'
  getAllRichiesteAmiciziaRicevuteEinAttesaURL: string = '/api/v1/homeService/richiesteInAttesaUtenti/'
  putAccettaRichiestaAmicizaURL: string = '/api/v1/homeService/richiestaAccettata/'
  deleteRifiutaRichiestaAmicizaURL: string = '/api/v1/homeService/richiestaRifiutata/'
  deleteCancellaAmiciziaURL: string = '/api/v1/homeService/cancellaAmicizia/'


  getAllFriendsURL: string = '/api/v1/homeService/getAllFriends/' // url per avere tutti gli amici di un certo utente
  getAllFriendsAreOnlineURL: string = '/api/v1/homeService/getAllFriendsAreOnline/'
  getInviaOffertaURL: string = '/api/v1/homeService/scambiController/inviaOfferta'
  getAllOfferteInviateURL: string = '/api/v1/homeService/scambiController/getAllOfferteInviate/'
  getAllOfferteRicevuteURL: string = '/api/v1/homeService/scambiController/getAllOfferte/'
  putAccettaOffertaURL: string = '/api/v1/homeService/scambiController/accettaOfferta/'
  putControffertaURL: string = '/api/v1/homeService/scambiController/controfferta'
  getUltimaControffertaURL: string = '/api/v1/homeService/scambiController/getUltimaControfferta/'
  deleteOffertaTramiteIdURL: string = '/api/v1/homeService/scambiController/cancellaOffertaTramiteId/'
  deleteOffertaTramiteIdStartURL: string = '/api/v1/homeService/scambiController/cancellaOffertaTramiteIdStart/'

  constructor(private http: HttpClient) {}

  postInviaRichiestaAmico(nicknameU1: String, nicknameU2: String){

    console.log(`${this.postInviaRichiestaAmicoURL}`+`${nicknameU1}`+ '/' +`${nicknameU2}`)
    return this.http.post(`${this.postInviaRichiestaAmicoURL}`+`${nicknameU1}`+ '/' +`${nicknameU2}`, null, {responseType: 'text'});
  }

  getAllRichiesteRicevuteEinAttesa(nickname: String) {
    return this.http.get<any>(`${this.getAllRichiesteAmiciziaRicevuteEinAttesaURL}`+`${nickname}`) // riceverà una lista di stringhe in formato JSON
  }

  putAccettaRichiestaAmiciza(nicknameU1: string, nicknameU2: string): Observable<any>{
    return this.http.put(`${this.putAccettaRichiestaAmicizaURL}`+`${nicknameU1}`+ '/' +`${nicknameU2}`, null, {responseType: 'text'});
  }

  deleteRifiutaRichiestaAmiciza(nicknameU1: string, nicknameU2: string){
    return this.http.delete(`${this.deleteRifiutaRichiestaAmicizaURL}`+`${nicknameU1}`+ '/' +`${nicknameU2}`, {responseType: 'text'});
  }

  deleteCancellaAmicizia(nicknameU1: string, nicknameU2: string){
    return this.http.delete(`${this.deleteCancellaAmiciziaURL}`+`${nicknameU1}`+ '/' +`${nicknameU2}`, {responseType: 'text'});
  }

  getAllFriends(nickname: String) {
    return this.http.get<any>(`${this.getAllFriendsURL}`+`${nickname}`) // riceverà una lista di stringhe in formato JSON
  }

  getAllFriendsAreOnline(nickname: String) {
    return this.http.get<any>(`${this.getAllFriendsAreOnlineURL}`+`${nickname}`) // riceverà una lista di stringhe in formato JSON
  }

  inviaOfferta(itemData: any): Observable<any>{
    return this.http.post(this.getInviaOffertaURL, itemData, {responseType: 'text'}); // ricordati di mettere {responseType: 'text'} SE IL REST RESTITUISCE UNA STRINGA!
  }

  getAllOfferteInviate(nickname: String) {
    return this.http.get<any>(`${this.getAllOfferteInviateURL}`+`${nickname}`) // riceverà una lista di oggetti della classe GestioneScambi in formato JSON
  }

  getAllOfferteRicevute(nickname: String) {
    return this.http.get<any>(`${this.getAllOfferteRicevuteURL}`+`${nickname}`) // riceverà una lista di oggetti della classe GestioneScambi in formato JSON
  }

  putAccettaOfferta(id: number) {
    return this.http.put(`${this.putAccettaOffertaURL}`+`${id}`, null, {responseType: 'text'}) // riceverà una stringa di risposta
  }

  putControfferta(itemData: any): Observable<any>{
    return this.http.put(this.putControffertaURL, itemData, {responseType: 'text'});
  }

  getUltimaControfferta(id: number) {
    return this.http.get(`${this.getUltimaControffertaURL}`+`${id}`) // riceverà un oggetto come risposta (se vuoto vuol dire che non ci sono state controfferte per l'offerta con l'id di input)
  }

  deleteOffertaTramiteId(id: number) {
    return this.http.delete(`${this.deleteOffertaTramiteIdURL}`+`${id}`,{responseType: 'text'}) // riceverà una stringa di risposta
  }

  deleteOffertaTramiteIdStart(idStart: number) {
    return this.http.delete(`${this.deleteOffertaTramiteIdStartURL}`+`${idStart}`, {responseType: 'text'}) // riceverà una stringa di risposta
  }


}
