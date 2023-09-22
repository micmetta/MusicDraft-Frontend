import { Injectable } from '@angular/core';

// QUESTO SERVICE DI ANGULAR LO UTILIZZO PER GESTIRE TUTTE gli oggetti COMPLESSI
// CONDIVISI TRA I COMPONENTI DEL FRONTEND.
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {


  private carta: any;
  private tipoCarta: any;
  private nicknamePropCarta: any;
  private NuovaSezione: string = '';
  private OffertaRicevuta: any;
  private Lista_carte_artisti_utente_ricevuta: any[] = [];
  private Lista_carte_brani_utente_ricevuta: any[] = [];

  private Lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];
  private Lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];

  constructor() { }

  setCartaData(data: any) {
    this.carta = data;
  }

  setTipoCartaData(tipo: any) {
    this.tipoCarta = tipo;
  }

  setNicknamePropCarta(nicknamePropCarta: any) {
    this.nicknamePropCarta = nicknamePropCarta;
  }

  setNuovaSezione(nuova_sezione: string){
    this.NuovaSezione = nuova_sezione;
  }

  setOffertaRicevuta(offerta_ricevuta: any){
    this.OffertaRicevuta = offerta_ricevuta;
  }

  setLista_carte_artisti_utente_ricevuta(lista_carte_artisti_utente_ricevuta: any[]){
    this.Lista_carte_artisti_utente_ricevuta = lista_carte_artisti_utente_ricevuta;
  }

  setLista_carte_brani_utente_ricevuta(lista_carte_brani_utente_ricevuta: any[]){
    this.Lista_carte_brani_utente_ricevuta = lista_carte_brani_utente_ricevuta;
  }


  setLista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta(lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta: any[]){
    this.Lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta = lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta;
  }

  setLista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta(lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta: any[]){
    this.Lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta = lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta;
  }




  getCartaData() {
    return this.carta;
  }

  getTipoCarta() {
    return this.tipoCarta;
  }

  getNicknamePropCarta() {
    return this.nicknamePropCarta;
  }

  getNuovaSezione() {
    return this.NuovaSezione;
  }

  getOffertaRicevuta(){
    return this.OffertaRicevuta;
  }

  getLista_carte_artisti_utente_ricevuta(){
    return this.Lista_carte_artisti_utente_ricevuta;
  }

  getLista_carte_brani_utente_ricevuta(){
    return this.Lista_carte_brani_utente_ricevuta;
  }


  getLista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta(){
    return this.Lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta;
  }

  getLista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta(){
    return this.Lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta;
  }


}
