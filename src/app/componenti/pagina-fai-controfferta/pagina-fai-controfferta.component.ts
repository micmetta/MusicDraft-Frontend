import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";
import {GestioneScambiService} from "../../servizi/home_service/gestione-scambi.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-pagina-fai-controfferta',
  templateUrl: './pagina-fai-controfferta.component.html',
  styleUrls: ['./pagina-fai-controfferta.component.css']
})
export class PaginaFaiControffertaComponent implements OnInit{

  private baseUrl2 = '/api/v1/cartemazzi';
  private apiUrl = ''; // la setto nell'NgOnInit
  private apiurl2=`${this.baseUrl2}/getUserArtista`
  private apiurl3=`${this.baseUrl2}/getUserBrano`
  decks: any; // I tuoi mazzi di carte


  offerta_ricevuta: any;
  lista_carte_offerte_ricevuta: any[] = []
  lista_tipi_carte_offerte_ricevuta: any[] = []

  lista_carte_artisti_utente_loggato: any = [];
  lista_carte_brani_utente_loggato: any = [];
  // lista_tipi_carte_artisti_utente_loggato: any = [];
  // lista_tipi_carte_brani_utente_loggato: any = [];

  lista_carte_artisti_utente_ricevuta: any[] = [];
  lista_carte_brani_utente_ricevuta: any[] = [];
  lista_carte_richieste_nella_controfferta: any[] = [];
  lista_tipi_carte_richieste_nella_controfferta: any[] = [];

  lista_carte_richieste_nella_controfferta_per_il_backend: any[] = [];

  lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];
  lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];

  constructor(private route: ActivatedRoute, private show:ShowCarteInVenditaService,
              private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private sharedDataService: SharedDataService,
              private gestioneScambiService: GestioneScambiService,
              private http: HttpClient,
              private dialog: MatDialog,
              private router: Router) {}


  ngOnInit(): void {

    if(this.sharedDataService.getOffertaRicevuta() === undefined){
      // ritorno alla pagina "scambi_carte" perchè la carta selezionata nella richiesta non è più disponibile:
      this.router.navigate(["/dashboard/scambi_carte"]);
    }
    else{
      this.offerta_ricevuta = this.sharedDataService.getOffertaRicevuta();
      this.lista_carte_artisti_utente_ricevuta = this.sharedDataService.getLista_carte_artisti_utente_ricevuta();
      this.lista_carte_brani_utente_ricevuta = this.sharedDataService.getLista_carte_brani_utente_ricevuta();
      this.lista_carte_offerte_ricevuta = this.convertStringToArray(this.offerta_ricevuta.lista_carte_offerte_ricevuta);
      this.lista_tipi_carte_offerte_ricevuta = this.offerta_ricevuta.lista_tipi_carte_offerte_ricevuta;

      console.log("this.offerta_inviata IN fai-controfferta: ");
      console.log(this.offerta_ricevuta);
      console.log("this.lista_carte_artisti_utente_ricevuta IN fai-controfferta: ");
      console.log(this.lista_carte_artisti_utente_ricevuta);
      console.log("this.lista_carte_brani_utente_ricevuta IN fai-controfferta: ");
      console.log(this.lista_carte_brani_utente_ricevuta);


      console.log("this.lista_carte_offerte_ricevuta IN fai-controfferta: ");
      console.log(this.lista_carte_offerte_ricevuta);
      console.log("this.lista_tipi_carte_offerte_ricevuta IN fai-controfferta: ");
      console.log(this.lista_tipi_carte_offerte_ricevuta);

      this.get_info_carte_utente_loggato(this.offerta_ricevuta);

      // Prendo tutti i mazzi dell'utente loggato (in modo tale che poi posso sapere quali carte può proporre e quali no):
      this.apiUrl = `${this.baseUrl2}/showMazzi/${this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged()}`;
      this.http.get<any[]>(this.apiUrl)
        .subscribe(
          (data: any[]) => {
            console.log("data:", data);
            const mazziAssociati: any = {};

            data.forEach(item => {

              const nomeMazzo = item.nomemazzo;

              if (!mazziAssociati[nomeMazzo]) {
                mazziAssociati[nomeMazzo] = {
                  nomemazzo: nomeMazzo,
                  carteassociate: [],
                  nickname: item.nickname
                };
              }

              // prova ad usare una lista di liste dove in ogni lista interna ti salvi la popolarità di quel mazzo.

              this.http.get<any>(this.apiurl2 + `/${item.cartaassociata}`)
                .subscribe(
                  (data: any) => {
                    if (data.length != 0) {

                      mazziAssociati[nomeMazzo].carteassociate.push(data);
                    } else {
                      this.http.get<any>(this.apiurl3 + `/${item.cartaassociata}`)
                        .subscribe(
                          (data: any) => {
                            if (data != null) {
                              mazziAssociati[nomeMazzo].carteassociate.push(data);
                            }
                          }
                        );

                    }
                  }
                );
            });
            // Ora puoi utilizzare mazziAssociati come desideri
            console.log("mazziAssociati:", mazziAssociati);

            // Esegui il codice che dipende da this.decks qui dentro
            this.decks = Object.values(mazziAssociati); // siccome non so il nome dei mazzi e quindi la chiave iniziale, allora uso Object.values(...)
            console.log("this.decks:");
            console.log(this.decks);
          }
        );
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    }
  }

  async get_info_carte_utente_loggato(offerta_ricevuta: any){

    // this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta = this.sharedDataService.getLista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta();
    // this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta = this.sharedDataService.getLista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta();
    // console.log("this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta IN ngOnInit di FAI-CONTROFFERTA: ");
    // console.log(this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);
    // console.log("this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta IN ngOnInit di FAI-CONTROFFERTA: ");
    // console.log(this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);


    // SETTO this.lista_carte_artisti_utente_loggato E this.lista_carte_brani_utente_loggato e i rispettivi tipi in modo
    // tale che l'html possa leggerle correttamente:

    const artistResponse = await this.show.getCarteArtistaByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)
    const branoResponse = await this.show.getCarteBranoByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)

    // Gestisci la risposta da getCarteArtistaByNickname
    // @ts-ignore
    this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(artistResponse).map((key) => artistResponse[key]);
    console.log("this.lista_carte_artisti_utente_loggato DELL'UTENTE loggato (IN ngOnInit di pagina-fai-controfferta): ", this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);

    // Gestisci la risposta da getCarteBranoByNickname
    // @ts-ignore
    this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(branoResponse).map((key) => branoResponse[key]);
    console.log("this.lista_carte_brani_utente_loggato DELL'UTENTE loggato (IN ngOnInit di pagina-fai-controfferta): ", this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);

  }



  // Metodo che toglie da this.lista_carte_offerte_ricevuta la carta i cui dati sono passati in input
  togli_carta(id_carta: string, tipo: string){

    console.log("Sono dentro togli_carta");

    console.log("id_carta: ", id_carta);
    console.log("tipo: ", tipo);
    console.log("this.lista_carte_offerte_ricevuta: ");
    console.log(this.lista_carte_offerte_ricevuta)
    console.log("this.lista_tipi_carte_offerte_ricevuta: ");
    console.log(this.lista_tipi_carte_offerte_ricevuta)

    //lista_carte.splice(k, 1);
    for(let i = 0; i < this.lista_carte_offerte_ricevuta.length; i++){
      if(this.lista_carte_offerte_ricevuta[i] == id_carta && this.lista_tipi_carte_offerte_ricevuta[i] == tipo){
        this.lista_carte_offerte_ricevuta.splice(i, 1); // cancello la carta trovata
        this.lista_tipi_carte_offerte_ricevuta.splice(i, 1); // cancello anche il tipo dalla lista tipi della carta trovata
        console.log("HO TROVATO LA CARTA DA CANCELLARE !!!");
      }
    }
  }


  togli_carta_proposta(carta_proposta: any, tipo:string) {

    console.log("Sono dentro togli_carta_proposta");

    for(let i = 0; i < this.lista_carte_richieste_nella_controfferta.length; i++){
      if(this.lista_carte_richieste_nella_controfferta[i].id == carta_proposta.id && this.lista_tipi_carte_richieste_nella_controfferta[i] == tipo){
        this.lista_carte_richieste_nella_controfferta.splice(i, 1); // cancello la carta trovata
        this.lista_tipi_carte_richieste_nella_controfferta.splice(i, 1); // cancello anche il tipo dalla lista tipi della carta trovata
        console.log("HO TROVATO LA CARTA DA CANCELLARE !!!");
      }
    }

  }



  // Questo metodo si preoccupa di prendere la carta selezionata e aggiungerla alla lista_carte_richieste_nella_controfferta
  // SOLO SE questa carta non è già presente o in offerta_ricevuta.lista_carte_offerte_ricevuta o in lista_carte_richieste_nella_controfferta.
  richiediCarta(carta: any, tipo: string){

    console.log("Sono dentro richiediCarta");
    console.log("this.lista_carte_offerte_ricevuta: ");
    console.log(this.lista_carte_offerte_ricevuta)

    let flag: boolean = false;

    for (let i = 0; i < this.lista_carte_offerte_ricevuta.length; i++){
      if(this.lista_carte_offerte_ricevuta[i] == carta.id && this.offerta_ricevuta.lista_tipi_carte_offerte_ricevuta[i] == tipo){
        console.log("Non è possibile aggiungere questa carta perchè è già presente nella lista_carte_offerte_ricevuta!");
        flag = true;
        this.openDialog_2('Errore duranta l\'aggiunta della carta richiesta', 'Non è possibile aggiungere questa carta perchè è già presente tra le carte che ti sono state offerte!');
      }
    }
    if(!flag){
      for (let i = 0; i < this.lista_carte_richieste_nella_controfferta.length; i++){
        if(this.lista_carte_richieste_nella_controfferta[i].id == carta.id && this.lista_tipi_carte_richieste_nella_controfferta[i] == tipo){
          console.log("Non è possibile aggiungere questa carta perchè è già presente nella lista_carte_richieste_nella_controfferta!");
          flag = true;
          this.openDialog_2('Errore duranta l\'aggiunta della carta richiesta', 'Non è possibile aggiungere questa carta perchè l\'hai già inserita nella lista delle carte che vuoi richiedere!');
        }
      }
    }
    if(!flag){
      // allora posso veramente aggiungere la carta all'interno di this.lista_carte_richieste_nella_controfferta e il suo tipo in this.lista_tipi_carte_richieste_nella_controfferta:
      this.lista_carte_richieste_nella_controfferta.push(carta);
      this.lista_tipi_carte_richieste_nella_controfferta.push(tipo);
    }
  }


  // metodo che si preoccupa di chiamare il backend per aggiungere la nuova controfferta (l'id start di this.offerta_ricevuta rimarrà chiaramente invariato)
  invia_controfferta(points_richiesti: number){

    // Adesso preparo il dizionario che conterrà tutti i dati della controfferta e invio la chiamata al backend:

    this.lista_carte_richieste_nella_controfferta_per_il_backend = this.lista_carte_richieste_nella_controfferta.map(carta => carta.id);
    console.log("this.offerta_ricevuta IN invia_controfferta: ", this.offerta_ricevuta)
    console.log("this.offerta_ricevuta.id_carta_richiesta_ricevuta IN invia_controfferta: ", this.offerta_ricevuta.id_carta_richiesta_ricevuta)
    console.log("this.lista_carte_richieste_nella_controfferta_per_il_backend: ", this.lista_carte_richieste_nella_controfferta_per_il_backend)
    console.log("this.lista_carte_offerte_ricevuta: ", this.lista_carte_offerte_ricevuta)


    // PRIMA DI PERMETTERGLI DI ACCETTARE L'OFFERTA DEVO VERIFICARE CHE CHE LE CARTE PRESENTI IN this.lista_carte_offerte_ricevuta NON SIANO PRESENTI IN NESSUN MAZZO
    let carta_aggiungibile: boolean = true;

    // GESTISCE IL CASO QUANDO L'UTENTE LOGGATO E' QUELLO CHE HA FATTO L'OFFERTA INIZIALE E QUINDI E' QUELLO CHE OFFRE LE CARTE IN LISTA CARTE OFFERTE E LISTA CARTE AGGIUNTIVE
    if((this.offerta_ricevuta.statoOfferta == "controfferta") && (!this.isPari(this.offerta_ricevuta.numControfferta))){
      for (const id_carta_offerta of this.lista_carte_offerte_ricevuta) {

        let carta_non_vendibile: any;

        for (const deck of this.decks) {

          console.log("deck: ", deck)
          console.log("deck.carteassociate: ", deck.carteassociate)

          for (const carta_associata of deck.carteassociate) {

            console.log("carta_associata[0].id: ", carta_associata[0].id)
            console.log("id_carta_offerta: ", id_carta_offerta)

            if(carta_associata[0].id == id_carta_offerta){
              carta_aggiungibile = false;
              carta_non_vendibile = carta_associata[0];
              break; // esco subito dal for interno
            }
          }
          if(!carta_aggiungibile){
            break // esco subito dal for interno
          }
        }

        if(!carta_aggiungibile){
          this.openDialog("La carta chiamata: " + carta_non_vendibile.nome + " è presente in 1 o più mazzi" , "NON PUOI AGGIUNGERE QUESTA CARTA NELLA LISTA-CARTE-OFFERTE PERCHE' E' GIA' PRESENTE IN ALMENO UN MAZZO, DEVI PRIMA TOGLIERLA DA TUTTI I MAZZI PRIMA DI POTERLA VENDERE AD UN ALTRO GIOCATORE!");
        }

      }

      // PRIMA DI PERMETTERGLI DI ACCETTARE L'OFFERTA DEVO VERIFICARE CHE LE CARTE PRESENTI IN this.lista_carte_richieste_nella_controfferta_per_il_backend NON SIANO PRESENTI IN NESSUN MAZZO
      for (const id_carta_offerta of this.lista_carte_richieste_nella_controfferta_per_il_backend) {

        let carta_non_vendibile: any;

        for (const deck of this.decks) {

          console.log("deck: ", deck)
          console.log("deck.carteassociate: ", deck.carteassociate)

          for (const carta_associata of deck.carteassociate) {

            console.log("carta_associata[0].id: ", carta_associata[0].id)
            console.log("id_carta_offerta: ", id_carta_offerta)

            if(carta_associata[0].id == id_carta_offerta){
              carta_aggiungibile = false;
              carta_non_vendibile = carta_associata[0];
              break; // esco subito dal for interno
            }
          }
          if(!carta_aggiungibile){
            break // esco subito dal for interno
          }
        }

        if(!carta_aggiungibile){
          this.openDialog("La carta chiamata: " + carta_non_vendibile.nome + " è presente in 1 o più mazzi" , "NON PUOI AGGIUNGERE QUESTA CARTA NELLA LISTA-CARTE-AGGIUNTIVE PERCHE' E' GIA' PRESENTE IN ALMENO UN MAZZO, DEVI PRIMA TOGLIERLA DA TUTTI I MAZZI PRIMA DI POTERLA VENDERE AD UN ALTRO GIOCATORE!");
        }

      }
    }
    // GESTISCE IL CASO QUANDO L'UTENTE LOGGATO E' QUELLO CHE HA RICEVUTO L'OFFERTA INIZIALE E QUINDI E' QUELLO CHE IN QUESTO MOMENTO VUOLE FARE UNA CONTROFFERTE PER CHIEDERE MAGARI CARTE
    // DIVERSE RISPETTO A QUELLE CHE GLI SONO STATE PROPOSTE:
    else if(this.isPari(this.offerta_ricevuta.numControfferta)){
      console.log("this.offerta_ricevuta.id_carta_richiesta_ricevuta: ", this.offerta_ricevuta.id_carta_richiesta_ricevuta)
      let carta_non_vendibile: any;
      for (const deck of this.decks) {
        console.log("deck: ", deck)
        console.log("deck.carteassociate: ", deck.carteassociate)
        for (const carta_associata of deck.carteassociate) {
          console.log("carta_associata[0].id: ", carta_associata[0].id)
          if(carta_associata[0].id == this.offerta_ricevuta.id_carta_richiesta_ricevuta){
            carta_aggiungibile = false;
            carta_non_vendibile = carta_associata[0];
            break; // esco subito dal for interno
          }
        }
        if(!carta_aggiungibile){
          break // esco subito dal for interno
        }
      }
      if(!carta_aggiungibile){
        this.openDialog("La carta chiamata: " + carta_non_vendibile.nome + " è presente in 1 o più mazzi" , "NON PUOI VENDERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN ALMENO UN MAZZO, DEVI PRIMA TOGLIERLA DA TUTTI I MAZZI PRIMA DI POTERLA VENDERE O PROPORA AD UN ALTRO GIOCATORE!");
      }
    }


    // SE NON C'E' NESSUNA CARTA NON VENDIBILE ALLORA LA CONTROFFERTA VERRA' INVIATA:
    if(carta_aggiungibile){
      // se this.lista_carte_offerte_ricevuta non è vuota aggiungo anche queste carte in this.lista_carte_richieste_nella_controfferta..
      // Perchè vuol dire che l'utente che sta facendo la controfferta vuole comunque mantenere le carte (o una parte di esse) che gli sono state offerte in precedente:
      if(this.lista_carte_offerte_ricevuta.length > 0){
        for (let i = 0; i < this.lista_carte_offerte_ricevuta.length; i++) {
          this.lista_carte_richieste_nella_controfferta_per_il_backend.push(this.lista_carte_offerte_ricevuta[i]);
          this.lista_tipi_carte_richieste_nella_controfferta.push(this.lista_tipi_carte_offerte_ricevuta[i]) // aggiungo anche il tipo per ogni carta
        }
      }

      console.log("Sono in invia_controfferta !!")
      console.log("this.lista_carte_offerte_ricevuta: ", this.lista_carte_offerte_ricevuta)
      console.log("this.lista_tipi_carte_offerte_ricevuta: ", this.lista_tipi_carte_offerte_ricevuta)
      console.log("this.lista_carte_richieste_nella_controfferta: ", this.lista_carte_richieste_nella_controfferta)
      console.log("this.lista_tipi_carte_richieste_nella_controfferta: ", this.lista_tipi_carte_richieste_nella_controfferta)
      console.log("points_richiesti: ", points_richiesti)
      console.log("this.offerta_ricevuta.idStart: ", this.offerta_ricevuta.idStart)

      this.gestioneScambiService.putControfferta(
        {
          nicknameU1: this.offerta_ricevuta.nicknameU1,
          nicknameU2: this.offerta_ricevuta.nicknameU2,
          idCartaRichiesta: this.offerta_ricevuta.id_carta_richiesta_ricevuta,
          tipoCartaRichiesta: this.offerta_ricevuta.tipo_carta_richiesta_ricevuta,
          listaCarteOfferte: JSON.stringify(this.lista_carte_richieste_nella_controfferta_per_il_backend), // la listaCarteOfferte adesso conterrà tutte le carte inserite durante la controfferta
          listaTipiCarteOfferte: JSON.stringify(this.lista_tipi_carte_richieste_nella_controfferta),
          pointsOfferti: points_richiesti,
          idStart: this.offerta_ricevuta.idStart
        }
      ).subscribe(data => {

        console.log("Risposta backend di putControfferta: ", data)

        if(data == "Controfferta inviata."){
          // Faccio apparire una finestra di dialogo che avverte l'utente dell'invio dell'offerta
          // e dopodichè lo riporto direttamente in "/dashboard/scambi_carte":
          this.openDialog('Controfferta Inviata con Successo', 'La controfferta è stata inviata con successo a ' + this.offerta_ricevuta.nickname_utente_richiesta_ricevuta + '!');
        }
        else{
          // Faccio apparire una finestra di dialogo che avverte l'utente che l'offerta non è stata inviata correttamente
          // e dopodichè lo riporto direttamente in "/dashboard/scambi_carte":
          this.openDialog('Errore nell\'invio della controfferta', 'Si è verificato un errore durante l\'invio della controfferta.');
        }
      })

    } // termine if(carta_aggiungibile)

  }


  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {

      // Adesso prima di ricaricare la pagina devi togliere la possibilitò all'utente di rifare una controfferta per la stessa offerta (tramite il suo id)
      // e usando get_ultima_controfferta dal backend..



      // Simula il ricaricamento del componente
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.sharedDataService.setNuovaSezione('Offerte-ricevute');
      this.router.navigate(["/dashboard/scambi_carte"]);

    });
  }

  openDialog_2(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {}); // non faccio nulla
  }



  convertStringToArray(jsonString: string): any[] {
    try {
      const jsonArray = JSON.parse(jsonString);
      if (Array.isArray(jsonArray)) {
        return jsonArray;
      }
    } catch (error) {
      console.error('Errore durante la conversione della stringa in array:', error);
    }
    return [];
  }


  isPari(numero: number): boolean {
    return numero % 2 === 0;
  }

}
