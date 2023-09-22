import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {GestioneScambiService} from "../../servizi/home_service/gestione-scambi.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";

@Component({
  selector: 'app-pagina-crea-offerta',
  templateUrl: './pagina-crea-offerta.component.html',
  styleUrls: ['./pagina-crea-offerta.component.css']
})
export class PaginaCreaOffertaComponent implements OnInit{

  carta_richiesta: any
  tipo_carta_richiesta: any
  nickn_propr_carta_richiesta: any


  // @ts-ignore
  user_offerta: string // nickname dell'utente al qualo voglio fare l'offerta

  // @ts-ignore
  nickname_user_logged: string // nickname utente loggato che vuole fare l'offerta
  lista_carte_artisti_utente : any
  lista_carte_brani_utente :any
  listaCarteOfferte : any[] = [];
  listaTipiCarteOfferte : any[] = [];
  pointsOfferti: number = 0;

  // per non far aggiungere ad una nuova offerta una carta già presente in un'offerta
  lista_offerte_inviate: any; // conterrà la lista delle offerte inviate dall'utente corrente
  lista_carte_offerte: any;
  lista_tipi_carte_offerte: string[] = [];



  //nuovoOggetto = ''; // Variabile per l'oggetto corrente

  constructor(private sharedDataService: SharedDataService,
              private nickname_loggedService: Nickname_and_email_user_loggedService,
              private show:ShowCarteInVenditaService,
              private gestioneScambiService: GestioneScambiService,
              private router: Router,
              private dialog: MatDialog) {}

  ngOnInit(): void {

    if(this.sharedDataService.getCartaData() === undefined){
      // ritorno alla pagina "scambi_carte" perchè la carta selezionata nella richiesta non è più disponibile:
      this.router.navigate(["/dashboard/scambi_carte"]);
    }
    else{
      // Recupero l'oggetto "carta richiesta" dal servizio condiviso:
      this.carta_richiesta = this.sharedDataService.getCartaData();
      this.tipo_carta_richiesta = this.sharedDataService.getTipoCarta();
      this.nickn_propr_carta_richiesta = this.sharedDataService.getNicknamePropCarta();

      console.log("carta_richiesta:", this.carta_richiesta);
      console.log("Nome carta_richiesta:", this.carta_richiesta.nome);
      console.log("Nome tipo_carta_richiesta:", this.tipo_carta_richiesta);


      // Recupero il parametro dalla query string che contiene il nickname dell'utente del quale voglio vedere le carte:
      this.nickname_user_logged = this.nickname_loggedService.getStoredNickname_user_logged();


      // Ora invoco il backend per farmi passare tutte le carte dell'utente con nickname->"user_offerta":
      this.show.getCarteArtistaByNickname(this.nickname_user_logged)
        .subscribe(((data:any)=>{
          this.lista_carte_artisti_utente= Object.keys(data).map((key)=>{return data[key]});
          console.log(data);
        }))
      this.show.getCarteBranoByNickname(this.nickname_user_logged)
        .subscribe(((data:any)=>{
          this.lista_carte_brani_utente = Object.keys(data).map((key)=>{return data[key]});
          console.log(data);
        }))
    }

  }

  // Aggiungi una nuova carta offerta alla listaCarteOfferte
  aggiungiCarta(carta: any) {
      this.listaCarteOfferte.push(carta);
  }

  // Aggiungi il tipo della nuova carta appena aggiunta alla listaCarteOfferte
  aggiungiTipoCarta(tipo: string) {
    this.listaTipiCarteOfferte.push(tipo);
  }


  // Rimuovi un oggetto da listaCarteOfferte e da listaTipiCarteOfferte
  rimuoviOggetto(index: number) {
    this.listaCarteOfferte.splice(index, 1);
    this.listaTipiCarteOfferte.splice(index, 1);
  }


  async aggiungi_cartaA_Offerta(cartaA: any){

    // A questo punto sono certo che l'utente ha selezionato una carta da aggiungere alla listaCarteOfferte.
    // Quello che in realtà a me serve aggiungre in listaCarteOfferte è l'id di questa carta e per prenderlo
    // mi basta invocare cartaB.id:
    console.log("cartaA.id corrente: ", cartaA.id);

    // Qui controllo SE LA CARTA CHE SI VUOLE AGGIUNGERE ALL'OFFERTA NON SIA GIA' PRESENTE IN UN'ALTRA OFFERTA, qualora fosse così allora
    // avverto l'utente che questa cosa non può farla e non aggiungo la carta selezionata:
    this.lista_offerte_inviate = await this.gestioneScambiService.getAllOfferteInviate(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)
    let flag: boolean = true;

    // scorro le offerte inviate e vedo se in una di queste è già presente la carta che si vuole aggiungere alla nuova offerta:
    for (const offerta_inviata of this.lista_offerte_inviate) {

      this.lista_carte_offerte = JSON.parse(offerta_inviata.listaCarteOfferte);
      this.lista_tipi_carte_offerte = JSON.parse(offerta_inviata.listaTipiCarteOfferte);
      for (let i=0; i < this.lista_carte_offerte.length; i++){
        if((this.lista_carte_offerte[i] == cartaA.id) && (this.lista_tipi_carte_offerte[i] == "artista")){
          // allora la carta è già presente in un'altra offerta
          flag = false; // indica che non devo aggiungere questa carta alla nuova offerta
        }
      }
    }

    if(flag){
      // aggiungo la carta solo se il flag è true
      this.aggiungiCarta(cartaA); // aggiungo l'id di questa carta alla listaCarteOfferte
      this.aggiungiTipoCarta("artista"); // aggiungo anche il tipo di questa nuova carta appena aggiunta a listaCarteOfferte
    }
    else{
      console.log("NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN UN'ALTRA OFFERTA!")
      this.openDialog_2("Errore durante l'aggiunta della carta" , "NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN UN'ALTRA OFFERTA!");
    }
  }


  async aggiungi_cartaB_Offerta(cartaB: any){

    // A questo punto sono certo che l'utente ha selezionato una carta da aggiungere alla listaCarteOfferte.
    // Quello che in realtà a me serve aggiungre in listaCarteOfferte è l'id di questa carta e per prenderlo
    // mi basta invocare cartaB.id:
    console.log("cartaB.id corrente: ", cartaB.id);

    // Qui controllo SE LA CARTA CHE SI VUOLE AGGIUNGERE ALL'OFFERTA NON SIA GIA' PRESENTE IN UN'ALTRA OFFERTA, qualora fosse così allora
    // avverto l'utente che questa cosa non può farla e non aggiungo la carta selezionata:
    this.lista_offerte_inviate = await this.gestioneScambiService.getAllOfferteInviate(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)
    let flag: boolean = true;

    // scorro le offerte inviate e vedo se in una di queste è già presente la carta che si vuole aggiungere alla nuova offerta:
    for (const offerta_inviata of this.lista_offerte_inviate) {

      this.lista_carte_offerte = JSON.parse(offerta_inviata.listaCarteOfferte);
      this.lista_tipi_carte_offerte = JSON.parse(offerta_inviata.listaTipiCarteOfferte);
      for (let i=0; i < this.lista_carte_offerte.length; i++){
        if((this.lista_carte_offerte[i] == cartaB.id) && (this.lista_tipi_carte_offerte[i] == "brano")){
          // allora la carta è già presente in un'altra offerta
          flag = false; // indica che non devo aggiungere questa carta alla nuova offerta
        }
      }
    }

    if(flag){
      // aggiungo la carta solo se il flag è true
      this.aggiungiCarta(cartaB); // aggiungo l'id di questa carta alla listaCarteOfferte
      this.aggiungiTipoCarta("brano"); // aggiungo anche il tipo di questa nuova carta appena aggiunta a listaCarteOfferte
    }
    else{
      console.log("NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN UN'ALTRA OFFERTA!")
      this.openDialog_2("Errore durante l'aggiunta della carta" , "NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN UN'ALTRA OFFERTA!");
    }
  }

  submitForm() {
    // Qui gestisco l'invio dei dati del form al backend:
    console.log('Dati inviati -> listaCarteOfferte:', this.listaCarteOfferte);
    console.log('Dati inviati -> listaTipiCarteOfferte:', this.listaTipiCarteOfferte);
    console.log('Dati inviati -> pointsOfferti:', this.pointsOfferti);


    // Qui preparo la richiesta all'endpoint: http://localhost:8082/api/v1/homeService/scambiController/inviaOfferta
    // {
    // "nicknameU1": "Michele Metta",
    // "nicknameU2": "TonySoprano",
    // "idCartaRichiesta": "15",
    // "tipoCartaRichiesta": "brano",
    // "listaCarteOfferte": "[\"1\"]",
    // "listaTipiCarteOfferte": "[\"artista\"]",
    // "pointsOfferti": 150
    // }

    const nicknameU1 = this.nickname_user_logged;
    const nicknameU2 = this.nickn_propr_carta_richiesta;
    const idCartaRichiesta = this.carta_richiesta.id;
    const tipoCartaRichiesta = this.tipo_carta_richiesta;
    const idList: string[] = this.listaCarteOfferte.map(carta => carta.id); // estraggo tutti gli id di ogni carta presente in this.listaCarteOfferte
    const listaCarteOfferte: string = JSON.stringify(idList); // mi memorizzo in ListaCarteOfferte in formato JSON tutti gli id delle carte offerte
    const listaTipiCarteOfferte: String = JSON.stringify(this.listaTipiCarteOfferte);
    const pointsOfferti = this.pointsOfferti;

    console.log("nicknameU1: ", nicknameU1)
    console.log("nicknameU2: ", nicknameU2)
    console.log("idCartaRichiesta: ", idCartaRichiesta)
    console.log("tipoCartaRichiesta: ", tipoCartaRichiesta) // cerca di capire perchè non lo prende..
    console.log("listaCarteOfferte: ", listaCarteOfferte)
    console.log("listaTipiCarteOfferte: ", listaTipiCarteOfferte)
    console.log("pointsOfferti: ", pointsOfferti)


    this.gestioneScambiService.inviaOfferta(
      {
        nicknameU1: nicknameU1,
        nicknameU2: nicknameU2,
        idCartaRichiesta: idCartaRichiesta,
        tipoCartaRichiesta: tipoCartaRichiesta,
        listaCarteOfferte: listaCarteOfferte,
        listaTipiCarteOfferte: listaTipiCarteOfferte,
        pointsOfferti: pointsOfferti
      }
    ).subscribe(data => {
      console.log("Risposta backend di invia_offerta: ", data)

      if(data == "Offerta inviata."){
        // Faccio apparire una finestra di dialogo che avverte l'utente dell'invio dell'offerta
        // e dopodichè lo riporto direttamente in "/dashboard/scambi_carte":
        this.openDialog('Offerta Inviata con Successo', 'L\'offerta è stata inviata con successo a ' + this.nickn_propr_carta_richiesta + '!');
      }
      else{
        // Faccio apparire una finestra di dialogo che avverte l'utente che l'offerta non è stata inviata correttamente
        // e dopodichè lo riporto direttamente in "/dashboard/scambi_carte":
        this.openDialog('Errore nell\'invio dell\'offerta', 'Si è verificato un errore durante l\'invio dell\'offerta.');
      }
    })
  }

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {
      // Adesso ritorno nella pagina scambi_carte:
      this.router.navigate(["/dashboard/scambi_carte"])
    });
  }

  openDialog_2(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {
      // Adesso ritorno nella pagina scambi_carte:
      this.router.navigate(["/dashboard/crea_offerta"])
    });
  }


}
