import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ShowCarteInVenditaService } from "../../servizi/marketplace/show-carte-in-vendita.service";
import { Nickname_and_email_user_loggedService } from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {MatChip} from "@angular/material/chips";
import {MazzoService} from "../../servizi/mazzi/salva/salva-mazzi.service";
import {concatMap} from "rxjs/operators";
import {GestioneScambiService} from "../../servizi/home_service/gestione-scambi.service";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";
import {Router} from "@angular/router";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-pagina-mazzi',
  templateUrl: './pagina-mazzi.component.html',
  styleUrls: ['./pagina-mazzi.component.css']
})
export class PaginaMazziComponent {
  decks: any; // I tuoi mazzi di carte
  deck: any ; // Il mazzo in fase di modifica o aggiunta
  isEditing = false;
  selectedCard: any;
  availableCards: any[]=[];
  private baseUrl2 = '/api/v1/cartemazzi';
  carteSelezionate: any[] = []; // Inizializza l'array delle carte selezionate
  selectedCardToAdd: any | undefined;
  selectedDeck: any;
  creanuovomazzo:any;
  nomemazoattuale:any;
  c: any[] = [];
  modificamazzo:any


  permetti_annulla_modifica: boolean = true;
  nickname_utente_richiesta_ricevuta: any;
  id_carta_corrente_ricevuta: any;
  tipo_carta_richiesta_ricevuta: any;
  points_offerti_ricevuta: any;
  lista_carte_offerte_ricevuta: string[] = [];
  lista_tipi_carte_offerte_ricevuta: string[] = [];
  obj_vuoto_ricevuta: any;
  // Dichiarazione di un array di dizionari che conterrà per ogni "offerta_inviata" presente in lista_offerte_inviate tutte le info necessarie
  listaDiDizionari_offerta_inviata: {
    nickname_utente_richiesta_inviata: string,
    id_carta_richiesta: string,
    nome_carta_richiesta: string,
    tipo_carta_richiesta: string,
    lista_carte_offerte: any,
    lista_tipi_carte_offerte: any,
    immagine_carta: any,
    popolarita: number,
    genere: string,
    points_offerti: any,
    statoOfferta: string // "in_attesa" vuol dire che è un'offerta inviata, "controfferta" vuol dire che è una controfferta inviata.
    numControfferta: number
  }[] = [];

  // Dichiarazione di un array di dizionari che conterrà per ogni "offerta_ricevuta" presente in lista_offerte_ricevute tutte le info necessarie
  listaDiDizionari_offerta_ricevuta: {
    id_offerta_ricevuta: any,
    idStart: any,
    nickname_utente_richiesta_ricevuta: string,
    nicknameU1: string,
    nicknameU2: string,
    id_carta_richiesta_ricevuta: string,
    nome_carta_richiesta_ricevuta: string,
    tipo_carta_richiesta_ricevuta: string,
    lista_carte_offerte_ricevuta: any,
    lista_tipi_carte_offerte_ricevuta: any,
    immagine_carta_ricevuta: any,
    popolarita_ricevuta: number,
    genere_ricevuta: string,
    points_offerti_ricevuta: any,
    mostra_accetta_offerta: boolean,
    mostra_fai_controfferta: boolean,
    statoOfferta: string,
    numControfferta: number
  }[] = [];
  // @ts-ignore
  nickname_user_logged: string; // contiene il nickname dell'utente
  lista_carte_artisti_utente: any[] = [];
  lista_carte_brani_utente: any = [];
  lista_carte_artisti_utente_loggato: any = [];
  lista_carte_brani_utente_loggato: any = [];
  lista_carte_artisti_utente_ricevuta: any[] = [];
  lista_carte_brani_utente_ricevuta: any[] = [];
  lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];
  lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];
  lista_offerte_inviate: any; // conterrà la lista delle offerte inviate dall'utente corrente
  lista_offerte_ricevute: any; // conterrà la lista delle offerte ricevute dall'utente corrente
  nickname_utente_richiesta_inviata: any;
  id_carta_corrente: any;
  tipo_carta_richiesta: any;
  lista_carte_offerte: any;
  lista_tipi_carte_offerte: string[] = [];
  points_offerti: any;


  constructor(private http: HttpClient, private show: ShowCarteInVenditaService, private nick: Nickname_and_email_user_loggedService,private mazzoService: MazzoService, private gestioneScambiService: GestioneScambiService,  private router: Router,
              private sharedDataService: SharedDataService, private dialog: MatDialog) {
    this.selectedCardToAdd = undefined
  }

  ngOnInit() {

    this.nickname_user_logged = this.nick.getStoredNickname_user_logged(); // prendo subito il nickname dell'utente loggato
    console.log("this.nickname_user_logged: ", this.nickname_user_logged)

    const apiUrl = `${this.baseUrl2}/showMazzi/${this.nick.getStoredNickname_user_logged()}`;
    const apiurl2=`${this.baseUrl2}/getUserArtista`
    const apiurl3=`${this.baseUrl2}/getUserBrano`
    this.http.get<any[]>(apiUrl)
      .subscribe(
        (data: any[]) => {
          console.log("data:", data);
          const mazziAssociati: any = {};

          data.forEach(item => {
            const nomeMazzo = item.nomemazzo;

            console.log("nomeMazzo:", nomeMazzo);

            if (!mazziAssociati[nomeMazzo]) {
              mazziAssociati[nomeMazzo] = {
                nomemazzo: nomeMazzo,
                carteassociate: [],
                nickname: item.nickname
              };
            }

            this.http.get<any>(apiurl2+`/${item.cartaassociata}`)
              .subscribe(
                (data: any) => {
                  if(data.length!=0) {

                    mazziAssociati[nomeMazzo].carteassociate.push(data);
                  }else{
                    this.http.get<any>(apiurl3+`/${item.cartaassociata}`)
                      .subscribe(
                        (data: any) => {
                          if(data != null) {
                            mazziAssociati[nomeMazzo].carteassociate.push(data);
                          }}
                      );
                  }
                }
              );
          });

          // Ora puoi utilizzare mazziAssociati come desideri
          console.log("mazziAssociati:", mazziAssociati);

          // Esegui il codice che dipende da this.decks qui dentro
          this.decks = Object.values(mazziAssociati);
          this.caricaCarteUtente();
          console.log(this.decks);
        },
        (error) => {
          console.error('Errore durante il recupero dei mazzi', error);
        }
      );


    // 1) invoco il metodo di sotto per prendere già i dati della sezione "Offerte-inviate":
    this.onOfferteInviateSectionActivated();
    // 2) // invoco il metodo di sotto per prendere già i dati della sezione "Offerte-ricevute":
    this.onOfferteRicevuteSectionActivated();
  }


  rimuoviCarta(deck: any, carta: any) {
    console.log(carta.id);

    let found = false; // Variabile per tenere traccia dello stato della condizione

    for (let i = 0; i < deck.length; i++) {
      for (let j = 0; j < deck[i].length; j++) {
        if (deck[i][j].id === carta.id) {
          console.log("qui");
          deck[i].splice(j, 1); // Rimuovi l'elemento dalla sotto-array
          found = true; // Imposta la variabile found a true
          break; // Esci dal ciclo interno
        }
      }

      if (found) {
        break; // Esci anche dal ciclo esterno se la condizione è stata verificata
      }
    }

    // Filtra gli array vuoti
    deck = deck.filter((item: any) => item.length > 0);
    this.deck=deck;
    console.log(this.deck)
  }


  aggiungiCarta() {

      console.log(this.deck.length);
      console.log(this.deck)


      if (this.carteSelezionate && this.deck.length < 5 && this.deck.length+this.carteSelezionate.length<=5) {
        console.log("qui")
        for(const i in this.carteSelezionate) {
          console.log(this.carteSelezionate[i]);
          this.deck.push([this.carteSelezionate[i]]);
           // Puoi reimpostare su null invece di undefined
        }
        this.carteSelezionate = [];
      }
      this.selectedDeck.carteassociate=this.deck
    console.log(this.deck)
  }




  caricaCarteUtente() {
    this.show.getCarteArtistaByNickname(this.nick.getStoredNickname_user_logged()).subscribe(
      (data: any) => {
        const carteArtista = Object.keys(data).map((key) => data[key]);
        this.show.getCarteBranoByNickname(this.nick.getStoredNickname_user_logged()).subscribe(
          (data: any) => {
            const carteBrano = Object.keys(data).map((key) => data[key]);
            this.availableCards = [...carteArtista, ...carteBrano];
            console.log(this.availableCards);
          },
          (error) => {
            console.error('Errore durante il recupero delle carte Brano', error);
          }
        );
      },
      (error) => {
        console.error('Errore durante il recupero delle carte Artista', error);
      }
    );
    console.log(this.availableCards)
  }

  salvaMazzo() { // viene eseguito quando alla fine della creazione l'utente clicca su "Crea"

    const set = new Set(this.carteSelezionate);
    if (this.carteSelezionate.length === 5 && (this.carteSelezionate.length == set.size)) {

      if(this.deck.name != "" && this.deck.name != null){ // aggiunto dopo

        console.log(this.carteSelezionate)
        // Invia i dati al backend
        console.log(this.deck.name,this.carteSelezionate,this.nick.getStoredNickname_user_logged())
        this.mazzoService.creaNuovoMazzo(this.deck.name, this.carteSelezionate,this.nick.getStoredNickname_user_logged()).subscribe(
          (response) => {
            console.log("fatto")},
          (error) => {
            console.error('Errore durante la creazione del mazzo', error);
            // Gestisci gli errori, ad esempio, mostrando un messaggio all'utente
          }
        );
        this.isEditing = false;
        this.creanuovomazzo=false;
        this.selectedDeck=false;
      }
      else{
        alert('Devi inserire un nome da dare al mazzo!');
      }

    } else {
      alert('Devi selezionare esattamente 5 carte diverse prima di salvare il mazzo.');
    }
  }

  eliminaMazzo(deck: any) {
    const index = this.decks.indexOf(deck);
    if (index !== -1) {
      // Rimuovi il mazzo dall'array
      console.log(deck.nomemazzo)
      this.decks.splice(index, 1);
      this.http.delete(`/api/v1/cartemazzi/deleteMazzo/${deck.nomemazzo}`)
        .subscribe((response) => {
          console.log("fatto")});

    }
  }

  annullaModifica() {
    this.c=[]
    console.log(this.deck)
    for (const i in this.deck) {
      for (const j in this.deck[i]) {
        this.c.push(this.deck[i][j]) // pusho una carta per volta
      }
    }
    // per ogni carta pushata controllo se questa è presente in una qualche offerta ricevuta o inviata:
    console.log("carte del mazzo: ", this.c)
    let risp_carta_vendibile: boolean = true;
    for (const carta_mazzo of this.c) {
      risp_carta_vendibile = this.presenteIn_offerte_controfferte_Inviate(carta_mazzo);
      console.log("risp_carta_vendibile: ", risp_carta_vendibile)
    }
    if(risp_carta_vendibile){
      // quello che già facevo prima..
      this.isEditing = false;
      this.deck = {}; // Reimposta il mazzo in modo da cancellare i dati del form
    }
    else{
      this.openDialog("Non è possibbile annullare la modifica", "DEVI PRIMA TOGLIERE LE CARTE CHE HANNO GENERATO I CONFLITTI E POI PORAI ANNULLARE LE MODIFICHE!");
    }
  }



  creaNuovoMazzo() {
    this.isEditing = true;
    this.creanuovomazzo=true;
    this.deck = {}; // Crea un nuovo mazzo vuoto
  }

  modificaMazzo(deck:any) {
    this.isEditing = true;
    this.modificamazzo=true
    this.selectedDeck = deck;
    this.nomemazoattuale=deck.nomemazzo
    console.log(this.nomemazoattuale)
    console.log(deck.carteassociate)
    for(const oggetto in deck.carteassociate){
      console.log(deck.carteassociate[oggetto])
    }
    this.deck=deck.carteassociate
  }


  toggleCardSelection(card: any) {
    const index = this.carteSelezionate.findIndex((c) => c.id === card.id);

    if (index !== -1) {
      // Rimuovi la carta dalla selezione
      this.carteSelezionate.splice(index, 1);
    } else {
      // Aggiungi la carta alla selezione se il limite di 5 carte non è stato raggiunto
      if (this.carteSelezionate.length < 5) {
        this.carteSelezionate.push(card);
      }
    }

  }

  isSelected(card: any): boolean {

    return this.carteSelezionate.some((c) => c.id === card.id);

  }

  isPari(numero: number): boolean {
    return numero % 2 === 0;
  }


  // Questo metodo sarà invocato da processNextItem per gestire in MANIERA SINCRONA TUTTO IL CODICE PRESENTE QUI SOTTO:
  handleResponse_Artista(response: any, offerta_inviata: any, mostra_accetta_offerta: boolean, mostra_fai_controfferta: boolean) {
    // Gestisci la risposta come desideri
    console.log("response:", response);
    this.lista_carte_artisti_utente = Object.keys(response).map((key) => response[key]);
    console.log("this.lista_carte_artisti_utente DI COLUI CHE HA RICEVUTO L'OFFERTA: ", this.lista_carte_artisti_utente);

    // Adesso posso aggiungere l'elemento a this.listaDiDizionari_offerta_inviate e fare altre operazioni se necessario.
    // Adesso scorro la "this.lista_carte_artisti_utente" per trovare proprio la carta con "this.id_carta_corrente":
    for (const carta of this.lista_carte_artisti_utente) {
      console.log("carta.id: ", carta.id);
      console.log("this.id_carta_corrente richiesta: ",  this.id_carta_corrente);

      if(carta.id == this.id_carta_corrente) {

        if (!mostra_accetta_offerta && !mostra_fai_controfferta) { // questa volta devo essere certo che questa sia effettivamente un'offerta inviata e non una controfferta ricevuta dall'utente loggato

          // Ho trovato la carta che mi interessa e quindi ora posso salvarmi tutte le info necessarie:
          let nuovoElemento = {
            nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_inviata,
            id_carta_richiesta: this.id_carta_corrente,
            nome_carta_richiesta: carta.nome,
            tipo_carta_richiesta: this.tipo_carta_richiesta,
            lista_carte_offerte: this.lista_carte_offerte,
            lista_tipi_carte_offerte: this.lista_tipi_carte_offerte,
            immagine_carta: carta.immagine,
            popolarita: carta.popolarita,
            genere: carta.genere,
            points_offerti: this.points_offerti,
            statoOfferta: "in_attesa",
            numControfferta: offerta_inviata.numControfferta
          }
          this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
          console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);
        }
        else{
          // Quando entro qui sono certo che l'offerta corrente è una controfferta ad un'offerta precedente fatta dall'utente loggato e quindi adesso
          // questa controfferta dovrò inserirla in this.listaDiDizionari_offerta_ricevuta dell'utente loggato:

          // creo quella che adesso è una controfferta ricevuta e la inserisco nella this.listaDiDizionari_offerta_ricevuta:

          // let nuovoElemento = {
          //   id_offerta_ricevuta: offerta_ricevuta.id,
          //   idStart: offerta_ricevuta.idStart,
          //   nickname_utente_richiesta_ricevuta: this.nickname_utente_richiesta_ricevuta,
          //   nicknameU1: this.nickname_utente_richiesta_ricevuta,
          //   nicknameU2: this.nickname_user_logged,
          //   id_carta_richiesta_ricevuta: this.id_carta_corrente_ricevuta,
          //   nome_carta_richiesta_ricevuta: carta.nome,
          //   tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta_ricevuta,
          //   lista_carte_offerte_ricevuta: this.lista_carte_offerte_ricevuta,
          //   lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte_ricevuta,
          //   immagine_carta_ricevuta: carta.immagine,
          //   popolarita_ricevuta: carta.popolarita,
          //   genere_ricevuta: carta.genere,
          //   points_offerti_ricevuta: this.points_offerti_ricevuta,
          //   mostra_accetta_offerta: mostra_accetta_offerta,
          //   mostra_fai_controfferta: mostra_fai_controfferta,
          //   statoOfferta: offerta_ricevuta.statoOfferta
          // }
          // this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
          // console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);

          let nuovoElemento = {
            id_offerta_ricevuta: offerta_inviata.id,
            idStart: offerta_inviata.idStart,
            nickname_utente_richiesta_ricevuta: this.nickname_user_logged,
            nicknameU1: this.nickname_user_logged,
            nicknameU2: this.nickname_utente_richiesta_inviata,
            id_carta_richiesta_ricevuta: this.id_carta_corrente,
            nome_carta_richiesta_ricevuta: carta.nome,
            tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta,
            lista_carte_offerte_ricevuta: this.lista_carte_offerte,
            lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte,
            immagine_carta_ricevuta: carta.immagine,
            popolarita_ricevuta: carta.popolarita,
            genere_ricevuta: carta.genere,
            points_offerti_ricevuta: this.points_offerti,
            mostra_accetta_offerta: mostra_accetta_offerta,
            mostra_fai_controfferta: mostra_fai_controfferta,
            statoOfferta: offerta_inviata.statoOfferta,
            numControfferta: offerta_inviata.numControfferta
          }
          this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
          console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);

        }
      }
    }
  }


  // Questo metodo sarà invocato da processNextItem per gestiore in MANIERA SINCRONA TUTTO IL CODICE PRESENTE QUI SOTTO:
  handleResponse_Brano(response: any, offerta_inviata: any, mostra_accetta_offerta: boolean, mostra_fai_controfferta: boolean) {
    // Gestisci la risposta come desideri
    console.log("response:", response);
    this.lista_carte_brani_utente = Object.keys(response).map((key) => response[key]);
    console.log("this.lista_carte_brani_utente DI COLUI CHE HA RICEVUTO L'OFFERTA: ", this.lista_carte_brani_utente);

    // Adesso posso aggiungere l'elemento a this.listaDiDizionari_offerta_inviate e fare altre operazioni se necessario.
    // Adesso scorro la "this.lista_carte_artisti_utente" per trovare proprio la carta con "this.id_carta_corrente":
    for (const carta of this.lista_carte_brani_utente) {
      console.log("carta.id: ", carta.id);
      console.log("this.id_carta_corrente richiesta: ",  this.id_carta_corrente);

      if(carta.id == this.id_carta_corrente) {


        if (!mostra_accetta_offerta && !mostra_fai_controfferta) { // questa volta devo essere certo che questa sia effettivamente un'offerta inviata e non una controfferta ricevuta dall'utente loggato

          // Ho trovato la carta che mi interessa e quindi ora posso salvarmi tutte le info necessarie:
          let nuovoElemento = {
            nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_inviata,
            id_carta_richiesta: this.id_carta_corrente,
            nome_carta_richiesta: carta.nome,
            tipo_carta_richiesta: this.tipo_carta_richiesta,
            lista_carte_offerte: this.lista_carte_offerte,
            lista_tipi_carte_offerte: this.lista_tipi_carte_offerte,
            immagine_carta: carta.immagine,
            popolarita: carta.popolarita,
            genere: carta.genere,
            points_offerti: this.points_offerti,
            statoOfferta: "in_attesa",
            numControfferta: offerta_inviata.numControfferta
          }
          this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
          console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);
        }
        else{
          // Quando entro qui sono certo che l'offerta corrente è una controfferta ad un'offerta precedente fatta dall'utente loggato e quindi adesso
          // questa controfferta dovrò inserirla in this.listaDiDizionari_offerta_ricevuta dell'utente loggato:

          // creo quella che adesso è una controfferta ricevuta e la inserisco nella this.listaDiDizionari_offerta_ricevuta:

          // let nuovoElemento = {
          //   id_offerta_ricevuta: offerta_ricevuta.id,
          //   idStart: offerta_ricevuta.idStart,
          //   nickname_utente_richiesta_ricevuta: this.nickname_utente_richiesta_ricevuta,
          //   nicknameU1: this.nickname_utente_richiesta_ricevuta,
          //   nicknameU2: this.nickname_user_logged,
          //   id_carta_richiesta_ricevuta: this.id_carta_corrente_ricevuta,
          //   nome_carta_richiesta_ricevuta: carta.nome,
          //   tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta_ricevuta,
          //   lista_carte_offerte_ricevuta: this.lista_carte_offerte_ricevuta,
          //   lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte_ricevuta,
          //   immagine_carta_ricevuta: carta.immagine,
          //   popolarita_ricevuta: carta.popolarita,
          //   genere_ricevuta: carta.genere,
          //   points_offerti_ricevuta: this.points_offerti_ricevuta,
          //   mostra_accetta_offerta: mostra_accetta_offerta,
          //   mostra_fai_controfferta: mostra_fai_controfferta,
          //   statoOfferta: offerta_ricevuta.statoOfferta
          // }
          // this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
          // console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);

          let nuovoElemento = {
            id_offerta_ricevuta: offerta_inviata.id,
            idStart: offerta_inviata.idStart,
            nickname_utente_richiesta_ricevuta: this.nickname_user_logged,
            nicknameU1: this.nickname_user_logged,
            nicknameU2: this.nickname_utente_richiesta_inviata,
            id_carta_richiesta_ricevuta: this.id_carta_corrente,
            nome_carta_richiesta_ricevuta: carta.nome,
            tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta,
            lista_carte_offerte_ricevuta: this.lista_carte_offerte,
            lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte,
            immagine_carta_ricevuta: carta.immagine,
            popolarita_ricevuta: carta.popolarita,
            genere_ricevuta: carta.genere,
            points_offerti_ricevuta: this.points_offerti,
            mostra_accetta_offerta: mostra_accetta_offerta,
            mostra_fai_controfferta: mostra_fai_controfferta,
            statoOfferta: offerta_inviata.statoOfferta,
            numControfferta: offerta_inviata.numControfferta
          }
          this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
          console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);
        }
      }
    }
  }


  async onOfferteRicevuteSectionActivated() {

    console.log("SONO ENTRATO IN onOfferteRicevuteSectionActivated")

    // DEVO FARLO ANCHE QUI PERCHE' onOfferteRicevuteSectionActivated() e onOfferteInviateSectionActivated() VENGONO ESEGUITE IN PARALLELO:
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const artisteResponse = await this.show.getCarteArtistaByNickname(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)
    const branoResponse = await this.show.getCarteBranoByNickname(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)

    // Gestisci la risposta da getCarteArtistaByNickname
    // @ts-ignore
    this.lista_carte_artisti_utente_loggato = Object.keys(artisteResponse).map((key) => artisteResponse[key]);
    console.log("this.lista_carte_artisti_utente_loggato DELL'UTENTE LOGGATO in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_loggato);

    // Gestisci la risposta da getCarteBranoByNickname
    // @ts-ignore
    this.lista_carte_brani_utente_loggato = Object.keys(branoResponse).map((key) => branoResponse[key]);
    console.log("this.lista_carte_brani_utente_loggato DELL'UTENTE LOGGATO in onOfferteRicevuteSectionActivated(): ", this.lista_carte_brani_utente_loggato);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    await this.gestioneScambiService.getAllOfferteRicevute(this.nickname_user_logged)
      .pipe(
        concatMap((data: any) => {
          // Gestisci la risposta dal backend qui
          console.log('Risposta dal backend in onOfferteRicevuteSectionActivated():', data);
          this.lista_offerte_ricevute = data;

          // Inizia la catena di chiamate asincrone
          return this.processNextItem_ricevute(0); // da qui in poi invoco le chiamate asincrone in maniera ricorsiva, la prima chiamata sarà proprio questa (infatti index = 0)
        })
      )
      .subscribe(() => {
        // Tutte le operazioni asincrone sono state completate
        console.log("Le Operazioni asincrone PER LA RICEZIONE DELLE OFFERTE RICEVUTE sono state completate.");
      });
  }


  // Ogni chiamata ricorsiva eseguirà questo codice in maniera sequenziale.
  // Questo metodo si preoccupa di prendere tutte le carte dell'utente che ha inviato all'utente loggato una certa offerta.
  async processNextItem_ricevute(index: number) {

    let offerta_ricevuta: any;
    let mostra_accetta_offerta: boolean = true;
    let mostra_fai_controfferta: boolean = true;

    if (index < this.lista_offerte_ricevute.length) {

      offerta_ricevuta = this.lista_offerte_ricevute[index];

      console.log("offerta_ricevuta.id corrente:", offerta_ricevuta.id)
      console.log("offerta_ricevuta:", offerta_ricevuta)

      // se l'offerta_ricevuta è una controfferta allora non la mostro perchè sono certo di aver già mostrato quella più recente:
      if((offerta_ricevuta.statoOfferta != "controfferta")) {

        // Adesso controllo se l'offerta_ricevuta corrente ha ricevuto già delle controfferte da parte dell'utente corrente, perchè se così fosse io permetterò a quest'ultimo di poter
        // vedere nella sezione 'Offerte-ricevute' solamente l'ultima controfferta che ha fatto (senza permettergli di poter fare un'altra controfferta ovviamente):
        const ultima_controfferta = await this.gestioneScambiService.getUltimaControfferta(offerta_ricevuta.id).toPromise(); // chiamata sincrona (senza .subscribe)

        console.log("Sono PRIMA di ultima_controfferta != null:")
        console.log(ultima_controfferta)

        if (ultima_controfferta != null) {
          console.log("Sono DENTRO ultima_controfferta != null:")
          console.log(ultima_controfferta)
          // vuol dire che l'utente loggato ha già fatto una controfferta e quindi l'offerta_ricevuta che vedrà nella sezione 'Offerte-ricevute'
          // sarà proprio l'ultima controfferta che ha fatto
          offerta_ricevuta = ultima_controfferta;

          // Qui faccio un controllo che mi serve per capire se l'ultima controfferta l'ha fatta l'utente loggato o meno:
          if( (this.nickname_user_logged == offerta_ricevuta.nicknameU2) && (!this.isPari(offerta_ricevuta.numControfferta)) ){
            mostra_accetta_offerta = false;
            mostra_fai_controfferta = false;
          }
        }

        this.nickname_utente_richiesta_ricevuta = offerta_ricevuta.nicknameU1; // questo è il nickname dell'utente che ha inviato la richiesta, quello che l'ha ricevuta adesso è l'utente loggato
        this.id_carta_corrente_ricevuta = offerta_ricevuta.idCartaRichiesta; // carta dell'utente loggato
        this.tipo_carta_richiesta_ricevuta = offerta_ricevuta.tipoCartaRichiesta; // tipo carta richiesta dell'utente loggato
        this.points_offerti_ricevuta = offerta_ricevuta.pointsOfferti;
        this.lista_carte_offerte_ricevuta = offerta_ricevuta.listaCarteOfferte; // lista carte offerte da parte dell'utente che ha inviato la richiesta
        this.lista_tipi_carte_offerte_ricevuta = JSON.parse(offerta_ricevuta.listaTipiCarteOfferte); // lista tipi carte offerte da parte dell'utente che ha inviato la richiesta

        console.log("this.id_carta_corrente_ricevuta richiesta: ", this.id_carta_corrente_ricevuta);
        console.log("this.tipo_carta_richiesta_ricevuta: ", this.tipo_carta_richiesta_ricevuta);
        console.log("this.lista_carte_offerte_ricevuta: ", this.lista_carte_offerte_ricevuta);
        console.log("this.lista_tipi_carte_offerte_ricevuta: ", this.lista_tipi_carte_offerte_ricevuta);
        console.log("this.lista_tipi_carte_offerte_ricevuta[0]: ", this.lista_tipi_carte_offerte_ricevuta[0]);


        // DEVO FARLO ANCHE QUI PERCHE' onOfferteRicevuteSectionActivated() e onOfferteInviateSectionActivated() VENGONO ESEGUITE IN PARALLELO:
        // - I metodi this.show.getCarteArtistaByNickname e this.show.getCarteBranoByNickname qui sotto devono essere chiamati per ogni offerta inviata perchè ogni volta il this.nickname_utente_richiesta_ricevuta potrebbe cambiare.
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const artisteResponse = await this.show.getCarteArtistaByNickname(this.nickname_utente_richiesta_ricevuta).toPromise(); // chiamata sincrona (senza .subscribe)
        const branoResponse = await this.show.getCarteBranoByNickname(this.nickname_utente_richiesta_ricevuta).toPromise(); // chiamata sincrona (senza .subscribe)

        // Gestisci la risposta da getCarteArtistaByNickname
        // @ts-ignore
        this.lista_carte_artisti_utente_ricevuta = Object.keys(artisteResponse).map((key) => artisteResponse[key]);
        console.log("this.lista_carte_artisti_utente_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_ricevuta);

        // Gestisci la risposta da getCarteBranoByNickname
        // @ts-ignore
        this.lista_carte_brani_utente_ricevuta = Object.keys(branoResponse).map((key) => branoResponse[key]);
        console.log("this.lista_carte_brani_utente_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_brani_utente_ricevuta);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        this.handleResponse_ricevuta_Artista_Brano(index, offerta_ricevuta, mostra_accetta_offerta, mostra_fai_controfferta);
      }

      else{

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // SETTO COMUNQUE this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta E this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta in modo
        // tale che l'html possa leggerle correttamente:

        const artisteResponse_2 = await this.show.getCarteArtistaByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)
        const branoResponse_2 = await this.show.getCarteBranoByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)

        // Gestisci la risposta da getCarteArtistaByNickname
        // @ts-ignore
        this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(artisteResponse_2).map((key) => artisteResponse_2[key]);
        console.log("this.Lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);

        // Gestisci la risposta da getCarteBranoByNickname
        // @ts-ignore
        this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(branoResponse_2).map((key) => branoResponse_2[key]);
        console.log("this.Lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Dopodichè richiamando questo metodo potrò valutare a questo punto la successiva "offerta_ricevuta":
        this.processNextItem_ricevute(index + 1);
      }

    }
  }


  // Questo metodo sarà invocato da processNextItem_ricevute per gestire in MANIERA SINCRONA TUTTO IL CODICE PRESENTE QUI SOTTO:
  // Questo metodo si preoccupa di scorrere ogni carta dell'utente loggato (quello che ha ricevuto l'offerta) e memorizzare nel dizionario per ogni richiesta ricevuta
  // le info della carta richiesta (che matcha con la carta dell'utente loggato) e memorizzare inoltre, sempre nel dizionario, anche le info delle carte che appartengono a
  // nicknameU1 e che sono quelle che sono state offerte da quest'ultima nell'offerta_ricevuta che sto valutando in questo momento:
  handleResponse_ricevuta_Artista_Brano(index: any, offerta_ricevuta: any, mostra_accetta_offerta: boolean, mostra_fai_controfferta: boolean) {

    // Adesso posso aggiungere l'elemento a this.listaDiDizionari_offerta_inviate e fare altre operazioni se necessario.
    // Adesso scorro la "this.lista_carte_artisti_utente" per trovare proprio la carta con "this.id_carta_corrente":

    console.log("offerta_ricevuta IN handleResponse_ricevuta_Artista_Brano: ")
    console.log(offerta_ricevuta)

    if(offerta_ricevuta.tipoCartaRichiesta == "artista"){

      console.log("this.lista_carte_artisti_utente_loggato: ")
      console.log(this.lista_carte_artisti_utente_loggato)

      for (const carta of this.lista_carte_artisti_utente_loggato) {

        console.log("carta.id: ", carta.id);
        console.log("this.id_carta_corrente_ricevuta richiesta: ",  this.id_carta_corrente_ricevuta);

        if(carta.id == this.id_carta_corrente_ricevuta) {

          // La carta richiesta l'ho trovata, adesso devo trovare tutte le info delle carte offerte da nicknameU1

          if (mostra_accetta_offerta && mostra_fai_controfferta) {

            // Ho trovato la carta che mi interessa e quindi ora posso salvarmi tutte le info necessarie:
            let nuovoElemento = {
              id_offerta_ricevuta: offerta_ricevuta.id,
              idStart: offerta_ricevuta.idStart,
              nickname_utente_richiesta_ricevuta: this.nickname_utente_richiesta_ricevuta,
              nicknameU1: this.nickname_utente_richiesta_ricevuta,
              nicknameU2: this.nickname_user_logged,
              id_carta_richiesta_ricevuta: this.id_carta_corrente_ricevuta,
              nome_carta_richiesta_ricevuta: carta.nome,
              tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta_ricevuta,
              lista_carte_offerte_ricevuta: this.lista_carte_offerte_ricevuta,
              lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte_ricevuta,
              immagine_carta_ricevuta: carta.immagine,
              popolarita_ricevuta: carta.popolarita,
              genere_ricevuta: carta.genere,
              points_offerti_ricevuta: this.points_offerti_ricevuta,
              mostra_accetta_offerta: mostra_accetta_offerta,
              mostra_fai_controfferta: mostra_fai_controfferta,
              statoOfferta: offerta_ricevuta.statoOfferta,
              numControfferta: offerta_ricevuta.numControfferta
            }
            this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
            console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);

          }

          else{
            // creo quella che adesso è una controfferta inviata e la inserisco nella this.listaDiDizionari_offerta_inviata:

            // let nuovoElemento = {
            //   nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_inviata,
            //   id_carta_richiesta: this.id_carta_corrente,
            //   nome_carta_richiesta: carta.nome,
            //   tipo_carta_richiesta: this.tipo_carta_richiesta,
            //   lista_carte_offerte: this.lista_carte_offerte,
            //   lista_tipi_carte_offerte: this.lista_tipi_carte_offerte,
            //   immagine_carta: carta.immagine,
            //   popolarita: carta.popolarita,
            //   genere: carta.genere,
            //   points_offerti: this.points_offerti
            // }
            // this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
            // console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);

            let nuovoElemento = {
              nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_ricevuta,
              id_carta_richiesta: this.id_carta_corrente_ricevuta,
              nome_carta_richiesta: carta.nome,
              tipo_carta_richiesta: this.tipo_carta_richiesta_ricevuta,
              lista_carte_offerte: this.lista_carte_offerte_ricevuta,
              lista_tipi_carte_offerte: this.lista_tipi_carte_offerte_ricevuta,
              immagine_carta: carta.immagine,
              popolarita: carta.popolarita,
              genere: carta.genere,
              points_offerti: this.points_offerti_ricevuta,
              statoOfferta: "controfferta",
              numControfferta: offerta_ricevuta.numControfferta
            }
            this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
            console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);

          }

        }
      }

    }
    else{

      // Se entro qui vuol dire che offerta_ricevuta.tipo_carta_richiesta == "brano" e quindi devo cercare la carta richiesta di questa offerta_ricevuta all'interno della lista brani
      // dell'utente loggato:
      for (const carta of this.lista_carte_brani_utente_loggato) {

        console.log("carta.id: ", carta.id);
        console.log("this.id_carta_corrente_ricevuta richiesta: ",  this.id_carta_corrente_ricevuta);

        if(carta.id == this.id_carta_corrente_ricevuta) {

          // La carta richiesta l'ho trovata, adesso devo trovare tutte le info delle carte offerte da nicknameU1

          if (mostra_accetta_offerta && mostra_fai_controfferta) {

            // Ho trovato la carta che mi interessa e quindi ora posso salvarmi tutte le info necessarie:
            let nuovoElemento = {
              id_offerta_ricevuta: offerta_ricevuta.id,
              idStart: offerta_ricevuta.idStart,
              nickname_utente_richiesta_ricevuta: this.nickname_utente_richiesta_ricevuta,
              nicknameU1: this.nickname_utente_richiesta_ricevuta,
              nicknameU2: this.nickname_user_logged,
              id_carta_richiesta_ricevuta: this.id_carta_corrente_ricevuta,
              nome_carta_richiesta_ricevuta: carta.nome,
              tipo_carta_richiesta_ricevuta: this.tipo_carta_richiesta_ricevuta,
              lista_carte_offerte_ricevuta: this.lista_carte_offerte_ricevuta,
              lista_tipi_carte_offerte_ricevuta: this.lista_tipi_carte_offerte_ricevuta,
              immagine_carta_ricevuta: carta.immagine,
              popolarita_ricevuta: carta.popolarita,
              genere_ricevuta: carta.genere,
              points_offerti_ricevuta: this.points_offerti_ricevuta,
              mostra_accetta_offerta: mostra_accetta_offerta,
              mostra_fai_controfferta: mostra_fai_controfferta,
              statoOfferta: offerta_ricevuta.statoOfferta,
              numControfferta: offerta_ricevuta.numControfferta
            }
            this.listaDiDizionari_offerta_ricevuta.push(nuovoElemento);
            console.log("this.listaDiDizionari_offerta_ricevuta DOPO IL PUSH:", this.listaDiDizionari_offerta_ricevuta);

          }

          else{
            // creo quella che adesso è una controfferta inviata e la inserisco nella this.listaDiDizionari_offerta_inviata:

            // let nuovoElemento = {
            //   nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_inviata,
            //   id_carta_richiesta: this.id_carta_corrente,
            //   nome_carta_richiesta: carta.nome,
            //   tipo_carta_richiesta: this.tipo_carta_richiesta,
            //   lista_carte_offerte: this.lista_carte_offerte,
            //   lista_tipi_carte_offerte: this.lista_tipi_carte_offerte,
            //   immagine_carta: carta.immagine,
            //   popolarita: carta.popolarita,
            //   genere: carta.genere,
            //   points_offerti: this.points_offerti
            // }
            // this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
            // console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);

            let nuovoElemento = {
              nickname_utente_richiesta_inviata: this.nickname_utente_richiesta_ricevuta,
              id_carta_richiesta: this.id_carta_corrente_ricevuta,
              nome_carta_richiesta: carta.nome,
              tipo_carta_richiesta: this.tipo_carta_richiesta_ricevuta,
              lista_carte_offerte: this.lista_carte_offerte_ricevuta,
              lista_tipi_carte_offerte: this.lista_tipi_carte_offerte_ricevuta,
              immagine_carta: carta.immagine,
              popolarita: carta.popolarita,
              genere: carta.genere,
              points_offerti: this.points_offerti_ricevuta,
              statoOfferta: "controfferta",
              numControfferta: offerta_ricevuta.numControfferta
            }
            this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
            console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);

          }

        }
      }
    }


    this.processNextItem_ricevute(index + 1); // richiamando questo metodo potrò valutare a questo punto la successiva "offerta_ricevuta"
  }




  async onOfferteInviateSectionActivated() {

    console.log("SONO ENTRATO IN onOfferteInviateSectionActivated")

    const artisteResponse = await this.show.getCarteArtistaByNickname(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)
    const branoResponse = await this.show.getCarteBranoByNickname(this.nickname_user_logged).toPromise(); // chiamata sincrona (senza .subscribe)

    // Gestisci la risposta da getCarteArtistaByNickname
    // @ts-ignore
    this.lista_carte_artisti_utente_loggato = Object.keys(artisteResponse).map((key) => artisteResponse[key]);
    console.log("this.lista_carte_artisti_utente_loggato DELL'UTENTE LOGGATO: ", this.lista_carte_artisti_utente_loggato);

    // Gestisci la risposta da getCarteBranoByNickname
    // @ts-ignore
    this.lista_carte_brani_utente_loggato = Object.keys(branoResponse).map((key) => branoResponse[key]);
    console.log("this.lista_carte_brani_utente_loggato DELL'UTENTE LOGGATO: ", this.lista_carte_brani_utente_loggato);


    await this.gestioneScambiService.getAllOfferteInviate(this.nickname_user_logged)
      .pipe(
        concatMap((data: any) => {
          // Gestisci la risposta dal backend qui
          console.log('Risposta dal backend in onOfferteInviateSectionActivated():', data);
          this.lista_offerte_inviate = data;

          // Inizia la catena di chiamate asincrone
          return this.processNextItem(0); // da qui in poi invoco le chiamate asincrone in maniera ricorsiva
        })
      )
      .subscribe(() => {
        // Tutte le operazioni asincrone sono state completate
        console.log("Operazioni asincrone completate.");
      });
  }

  // Ogni chiamata ricorsiva eseguirà questo codice in maniera sequenziale.
  async processNextItem(index: number) {

    let offerta_inviata: any;
    let mostra_accetta_offerta: boolean = false;
    let mostra_fai_controfferta: boolean = false;

    if (index < this.lista_offerte_inviate.length) {

      offerta_inviata = this.lista_offerte_inviate[index];

      // se l'offerta_inviata è una controfferta allora non la mostro perchè sono certo di aver già mostrato quella più recente:
      if((offerta_inviata.statoOfferta != "controfferta")) {


        // Adesso controllo se l'offerta_inviata corrente ha ricevuto già delle controfferte da parte dell'utente corrente, perchè se così fosse io permetterò a quest'ultimo di poter
        // vedere nella sezione 'Offerte-inviate' solamente l'ultima controfferta che ha fatto (senza permettergli di poter fare un'altra controfferta ovviamente):
        const ultima_controfferta = await this.gestioneScambiService.getUltimaControfferta(offerta_inviata.id).toPromise(); // chiamata sincrona (senza .subscribe)

        console.log("Sono PRIMA di ultima_controfferta != null:")
        console.log(ultima_controfferta)

        if (ultima_controfferta != null) {
          console.log("Sono DENTRO ultima_controfferta != null:")
          console.log(ultima_controfferta)
          // vuol dire che l'utente loggato ha già fatto una controfferta e quindi l'offerta_ricevuta che vedrà nella sezione 'Offerte-ricevute'
          // sarà proprio l'ultima controfferta che ha fatto
          offerta_inviata = ultima_controfferta;

          // Qui faccio un controllo che mi serve per capire se l'ultima controfferta l'ha ricevuta l'utente loggato o meno:
          if( (this.nickname_user_logged == offerta_inviata.nicknameU1) && (!this.isPari(offerta_inviata.numControfferta)) ){

            // Allora vuol dire che l'ultima controfferta l'ha ricevuta l'utente loggato e quindi dovrò spostarla nelle offerte ricevute di quest'ultimo
            mostra_accetta_offerta = true;
            mostra_fai_controfferta = true;
          }
        }

        this.nickname_utente_richiesta_inviata = offerta_inviata.nicknameU2;
        this.id_carta_corrente = offerta_inviata.idCartaRichiesta;
        this.tipo_carta_richiesta = offerta_inviata.tipoCartaRichiesta;
        this.points_offerti = offerta_inviata.pointsOfferti;
        this.lista_carte_offerte = offerta_inviata.listaCarteOfferte;
        this.lista_tipi_carte_offerte = JSON.parse(offerta_inviata.listaTipiCarteOfferte);


        console.log("this.id_carta_corrente richiesta: ", this.id_carta_corrente);
        console.log("this.tipo_carta_richiesta: ", this.tipo_carta_richiesta);
        console.log("this.lista_carte_offerte: ", this.lista_carte_offerte);
        console.log("this.lista_tipi_carte_offerte: ", this.lista_tipi_carte_offerte);
        console.log("this.lista_tipi_carte_offerte[0]: ", this.lista_tipi_carte_offerte[0]);

        if (this.tipo_carta_richiesta == 'artista') {
          this.show.getCarteArtistaByNickname(this.nickname_utente_richiesta_inviata)
            .subscribe((response: any) => {
              this.handleResponse_Artista(response, offerta_inviata, mostra_accetta_offerta, mostra_fai_controfferta);
              // Passa al prossimo elemento in modo ricorsivo
              this.processNextItem(index + 1);
            });
        } else {
          this.show.getCarteBranoByNickname(this.nickname_utente_richiesta_inviata)
            .subscribe((response: any) => {
              this.handleResponse_Brano(response, offerta_inviata, mostra_accetta_offerta, mostra_fai_controfferta);
              // Passa al prossimo elemento in modo ricorsivo
              this.processNextItem(index + 1);
            });
        }
      }
      else{
        this.processNextItem(index + 1); // richiamando questo metodo potrò valutare a questo punto la successiva "offerta_inviata"
      }


    }
  }



  // Per le offerte_ricevute invece tutti i controlli necessari li faccio direttamente nella sezione "offerte ricevute" di "pagina-scambi-carte.component.ts".
  presenteIn_offerte_controfferte_Inviate(carta: any){

    // controllo se la carta corrente è presente in qualche offerta inviata all'interno di una lista carte offerte:
    let carta_vendibile: boolean = true;
    let id_carta_conflitto: string = '';
    let nome_carta_conflitto: string = '';
    let tipo_offerta_conflitto: string = ''; // "offerte" o "controfferte"
    let tipo_offerta_conflitto_singolare: string = '';

    console.log("Sono prima del for (const offerta_inviata of this.listaDiDizionari_offerta_inviata)")
    console.log("this.listaDiDizionari_offerta_inviata: ")
    console.log(this.listaDiDizionari_offerta_inviata)

    // Adesso scorro le offerte-inviate:
    for (const offerta_inviata of this.listaDiDizionari_offerta_inviata) {

      console.log("offerta_inviata IN presenteInOfferte: ", offerta_inviata);

      if(offerta_inviata.statoOfferta == "in attesa"){
        // Allora vuol dire che devo controllere se nelle carte offerte di questa offerta inviata c'è una uguale a quella passata in input:
        for (const id_cartaOfferta of this.convertStringToArray(offerta_inviata.lista_carte_offerte)) {
          if(id_cartaOfferta == carta.id){
            id_carta_conflitto = carta.id;
            nome_carta_conflitto = carta.nome;
            tipo_offerta_conflitto = "OFFERTE"
            tipo_offerta_conflitto_singolare = "OFFERTA"
            carta_vendibile = false
            break // esco dal for interno
          }
        }
        if(!carta_vendibile){
          break // esco dal for più esterno
        }
      }
      else if((offerta_inviata.statoOfferta == "controfferta") && (!this.isPari(offerta_inviata.numControfferta))){
        // Allora devo controllare se la carta richiesta dell'utente loggato presente in questa offerta inviata è uguale a quella passata in input:
        if(offerta_inviata.id_carta_richiesta == carta.id){
          id_carta_conflitto = carta.id;
          nome_carta_conflitto = carta.nome;
          tipo_offerta_conflitto = "CONTROFFERTE"
          tipo_offerta_conflitto_singolare = "CONTROFFERTA"
          carta_vendibile = false
          break // esco direttamente dal for più esterno
        }
      }
      else{
        // Allora vuol dire che: offerta_inviata.statoOfferta == "controfferta" E offerta_inviata.numControfferta è pari, quindi in questo caso
        // devo vedere nelle carte se nelle carte offerte di questa offerta inviata c'è una uguale a quella passata in input:
        for (const id_cartaOfferta of this.convertStringToArray(offerta_inviata.lista_carte_offerte)) {
          if(id_cartaOfferta == carta.id){
            id_carta_conflitto = carta.id;
            nome_carta_conflitto = carta.nome;
            tipo_offerta_conflitto = "CONTROFFERTE"
            tipo_offerta_conflitto_singolare = "CONTROFFERTA"
            carta_vendibile = false
            break // esco dal for interno
          }
        }
        if(!carta_vendibile){
          break // esco dal for più esterno
        }
      }
    }

    if(!carta_vendibile){
      this.permetti_annulla_modifica = false;
      this.openDialog("La carta chiamata: '" + nome_carta_conflitto + "' è presente in 1 o più " +  tipo_offerta_conflitto, "NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN ALMENO UNA " + tipo_offerta_conflitto_singolare + " CHE HAI INVIATO, DEVI ATTENDERE PRIMA LA RISPOSTA E POI POTRAI AGGIUNGERLA AD UN MAZZO!");
    }

    return carta_vendibile;

  }




  modifyDeck() { // viene eseguito quando l'utente dopo aver eventualemente modificato il deck clicca su modifica

    this.c=[]
    console.log(this.deck)
    for (const i in this.deck) {
      for (const j in this.deck[i]) {
        this.c.push(this.deck[i][j]) // pusho una carta per volta
      }
    }

    // per ogni carta pushata controllo se questa è presente in una qualche offerta ricevuta o inviata:
    console.log("carte del mazzo: ", this.c)
    let risp_carta_vendibile: boolean = true;
    for (const carta_mazzo of this.c) {
      risp_carta_vendibile = this.presenteIn_offerte_controfferte_Inviate(carta_mazzo);
      console.log("risp_carta_vendibile: ", risp_carta_vendibile)
    }


    if(risp_carta_vendibile){ // la modifica del mazzo sarà concessa solo se risp_carta_vendibile è true

      console.log(this.c.length)
      console.log(this.deck.length)
      console.log(this.c)
      const contieneDuplicati = this.c.some((oggetto, indice, array) => {
        return array.findIndex((elemento) => elemento.id === oggetto.id) !== indice;
      });
      const set = new Set(this.c);
      if (this.c.length == 5) {
        if (!contieneDuplicati) {
          this.http.delete(`/api/v1/cartemazzi/deleteMazzo/${this.nomemazoattuale}`)
            .subscribe((response) => {
                console.log("fatto")
                this.mazzoService.creaNuovoMazzo(this.selectedDeck.nomemazzo, this.c, this.selectedDeck.nickname).subscribe(
                  (response) => {
                  },
                  (error) => {
                    console.error('Errore durante la creazione del mazzo', error);
                    // Gestisci gli errori, ad esempio, mostrando un messaggio all'utente
                  }
                );
              },
              (error) => {
                console.error('Errore durante la creazione del mazzo', error);
                // Gestisci gli errori, ad esempio, mostrando un messaggio all'utente
              })
          this.isEditing = false;
          this.modificamazzo=false;
        } else {
          alert('Devi selezionare esattamente 5 carte diverse prima di salvare il mazzo.');
        }
      }else{
        alert('Devi selezionare esattamente 5 carte diverse prima di salvare il mazzo.');
      }
    }
  }


  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {
      // Simula il ricaricamento del componente
      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      // //this.sharedDataService.setNuovaSezione('Offerte-ricevute');
      // this.router.navigate(["/dashboard/pagina_mazzi"]);
    });
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

}
