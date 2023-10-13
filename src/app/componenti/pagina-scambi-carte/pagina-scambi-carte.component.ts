import {Component, OnInit} from '@angular/core';
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {AuthService} from "../../auth/auth.service";
import {GestioneScambiService} from "../../servizi/home_service/gestione-scambi.service";
import {NavigationExtras, Router} from "@angular/router";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";

import { HttpClient } from '@angular/common/http';
import {concatMap, tap, toArray} from 'rxjs/operators';
import {concat, from, Observable} from "rxjs";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";
import {MatDialog} from "@angular/material/dialog";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";

@Component({
  selector: 'app-pagina-scambi-carte',
  templateUrl: './pagina-scambi-carte.component.html',
  styleUrls: ['./pagina-scambi-carte.component.css']
})
export class PaginaScambiCarteComponent implements OnInit {

  private baseUrl2 = '/api/v1/cartemazzi';
  private apiUrl = ''; // la setto nell'NgOnInit
  private apiurl2=`${this.baseUrl2}/getUserArtista`
  private apiurl3=`${this.baseUrl2}/getUserBrano`
  decks: any; // I tuoi mazzi di carte

  // @ts-ignore
  nickname_user_logged: string; // contiene il nickname dell'utente
  lista_amici: any; // conterrà i nickname degli amici dell'utente corrente
  selectedSection: string = 'Amici'; // Sezione predefinita selezionata 'Amici'
  nuova_sezione: string = '';


  lista_offerte_inviate: any; // conterrà la lista delle offerte inviate dall'utente corrente
  lista_offerte_ricevute: any; // conterrà la lista delle offerte ricevute dall'utente corrente

  nickname_utente_richiesta_inviata: any;
  id_carta_corrente: any;
  tipo_carta_richiesta: any;
  lista_carte_offerte: any;
  lista_tipi_carte_offerte: string[] = [];
  points_offerti: any;
  obj_vuoto: any;

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


  lista_carte_artisti_utente: any[] = [];
  lista_carte_brani_utente: any = [];
  lista_carte_artisti_utente_loggato: any = [];
  lista_carte_brani_utente_loggato: any = [];
  lista_carte_artisti_utente_ricevuta: any[] = [];
  lista_carte_brani_utente_ricevuta: any[] = [];

  lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];
  lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta: any[] = [];


  // nuovoElemento: any;

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private gestioneScambiService: GestioneScambiService,
              private show: ShowCarteInVenditaService,
              private router: Router,
              private dialog: MatDialog,
              private sharedDataService: SharedDataService,
              private http: HttpClient) {
  }

  ngOnInit(): void {

    if(this.sharedDataService.getNuovaSezione() != ''){
      this.selectedSection = this.sharedDataService.getNuovaSezione();
      this.sharedDataService.setNuovaSezione(''); // in modo tale da rivedere la sezione 'Amici' che è quella di default
    }


    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged();

    // richiedo tutti gli amici dell'utente corrente:
    this.gestioneScambiService.getAllFriends(this.nickname_user_logged).subscribe(data => {
        this.lista_amici = data;
      },
    )

    // LE 3 CHIAMATE DI SOTTO VERRANNO ESEGUITE IN PARALLELO:

    // Prendo tutti i mazzi dell'utente loggato (in modo tale che poi posso sapere quali carte può proporre e quali no):
    this.apiUrl = `${this.baseUrl2}/showMazzi/${this.nickname_user_logged}`;
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


    // invoco il metodo di sotto per prendere già i dati della sezione "Offerte-inviate":
    this.onOfferteInviateSectionActivated();

    // invoco il metodo di sotto per prendere già i dati della sezione "Offerte-ricevute":
    this.onOfferteRicevuteSectionActivated();


  }


  selectSection(section: string) {
    this.selectedSection = section;
  }

  // Metodo per richiedere tutti gli amici dell'utente corrente:
  get_allFriends() {
    this.gestioneScambiService.getAllFriends(this.nickname_user_logged).subscribe(data => {
        this.lista_amici = data;
      },
    )
  }

  faiOfferta(user_offerta: string): void {
    console.log('Fai offerta per: ', user_offerta);
    // Una volta cliccato su "fai offerta" l'utente vedrà tutte le carte (con alcune info) dell'utente su cui ha cliccato (identificato da user_offerta),
    // prima di ciò però aggiorno la pagina e vado a "/dashboard/fai_offerta" passandogli user_offerta.
    const navigationExtras: NavigationExtras = {
      queryParams: {parametro: user_offerta}
    };
    this.router.navigate(["/dashboard/fai_offerta"], navigationExtras); // vado alla pagina "fai_offerta"
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
            statoOfferta: "in_attesa"
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
            statoOfferta: "in_attesa"
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
              statoOfferta: "controfferta"
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
              statoOfferta: "controfferta"
            }
            this.listaDiDizionari_offerta_inviata.push(nuovoElemento);
            console.log("this.listaDiDizionari_offerta_inviata DOPO IL PUSH:", this.listaDiDizionari_offerta_inviata);

          }

        }
      }
    }


    this.processNextItem_ricevute(index + 1); // richiamando questo metodo potrò valutare a questo punto la successiva "offerta_ricevuta"
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

  accetta_offerta(offerta_ricevuta: any){

    console.log("Click su accetta offerta!!")
    console.log("offerta_ricevuta: ", offerta_ricevuta)

    console.log("this.convertStringToArray(offerta_ricevuta.lista_carte_offerte_ricevuta): ", this.convertStringToArray(offerta_ricevuta.lista_carte_offerte_ricevuta))

    console.log("offerta_ricevuta.id_offerta_ricevuta:")
    console.log(offerta_ricevuta.id_offerta_ricevuta)

    // console.log("this.decks: ", this.decks)

    // PRIMA DI PERMETTERGLI DI ACCETTARE L'OFFERTA DEVO VERIFICARE CHE CHE LE CARTE PRESENTI IN offerta_ricevuta.listaCarteOfferte NON SIANO PRESENTI IN NESSUN MAZZO
    let carta_aggiungibile: boolean = true;

    // QUESTO IF GESTISCE IL CASO IN CUI L'UTENTE LOGGATO E' QUELLO CHE VUOLE FARE LA CONTROFFERTA E OFFRE DELLE PROPRIE CARTE:
    if((offerta_ricevuta.statoOfferta == "controfferta") && (!this.isPari(offerta_ricevuta.numControfferta))){ // QUESTO FUNZIONA ORA DEVI GESTIRE GLI ALTRI CASI
      // E RICORDATI DI DECOMMENTARE QUELLO PRESENTE DENTRO if(carta_aggiungibile)...

      for (const id_carta_offerta of this.convertStringToArray(offerta_ricevuta.lista_carte_offerte_ricevuta)) {
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
          this.openDialog("La carta chiamata: " + carta_non_vendibile.nome + " è presente in 1 o più mazzi" , "NON PUOI AGGIUNGERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN ALMENO UN MAZZO, DEVI PRIMA TOGLIERLA DA TUTTI I MAZZI PRIMA DI POTERLA VENDERE AD UN ALTRO GIOCATORE!");
        }
      }
    }
    // QUESTO ELSE IF GESTISCE IL CASO IN CUI L'UTENTE LOGGATO E' QUELLO CHE HA RICEVUTO LA OFFERTA/CONTROFFERTA E QUINDI DEVE DECIDERE SE ACCETTARE E VENDERE LA CARTA RICHIESTA IN CAMBIO DELLA LISTA
    // CARTE OFFERTE E DEI POINTS:
    else if(this.isPari(offerta_ricevuta.numControfferta)){ // PUO' AVER RICEVUTO SIA UN'OFFERTA CHE UNA CONTROFFERTA

      console.log("offerta_ricevuta.id_carta_richiesta_ricevuta: ", offerta_ricevuta.id_carta_richiesta_ricevuta)
      let carta_non_vendibile: any;
      for (const deck of this.decks) {
        console.log("deck: ", deck)
        console.log("deck.carteassociate: ", deck.carteassociate)
        for (const carta_associata of deck.carteassociate) {
          console.log("carta_associata[0].id: ", carta_associata[0].id)
          if(carta_associata[0].id == offerta_ricevuta.id_carta_richiesta_ricevuta){
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
        this.openDialog("La carta chiamata: " + carta_non_vendibile.nome + " è presente in 1 o più mazzi" , "NON PUOI VENDERE QUESTA CARTA PERCHE' E' GIA' PRESENTE IN ALMENO UN MAZZO, DEVI PRIMA TOGLIERLA DA TUTTI I MAZZI PRIMA DI POTERLA VENDERE AD UN ALTRO GIOCATORE!");
      }
    }

    // SE NON C'E' NESSUNA CARTA NON VENDIBILE ALLORA LA CONTROFFERTA VERRA' INVIATA:
    if(carta_aggiungibile){
      // Poichè l'utente con nicknameU2 ha accettato l'offerta_ricevuta allora posso chiamare il backend per eseguire l'aggiornamento delle carte:
      this.gestioneScambiService.putAccettaOfferta(offerta_ricevuta.id_offerta_ricevuta).subscribe(((data:any)=>{
        console.log("Risposta da putAccettaOfferta(..): ");
        console.log(data);
        this.openDialog("Offerta accettata con successo!" , "LO SCAMBIO SI E' CONCLUSO CON SUCCESSO!");

        // Adesso aggiorno la pagina scambi_carte:
        // this.onOfferteRicevuteSectionActivated();
        // this.router.navigate(["/dashboard/home"]);
        // this.router.navigate(["/dashboard/scambi_carte"]);
      }))
    }

  }

  rifiuta_offerta(offerta_ricevuta: any){

    console.log("Click su rifiuta offerta!!")

    let id_start_offerta_da_cancellare = offerta_ricevuta.idStart;

    console.log("offerta_ricevuta:");
    console.log(offerta_ricevuta);
    console.log("offerta_ricevuta.id: ", offerta_ricevuta.id_offerta_ricevuta);
    console.log("id_start_offerta_da_cancellare: ", id_start_offerta_da_cancellare);


    // Invoco il backend per cancellare l'offerta corrente tramite il suo id:
    this.gestioneScambiService.deleteOffertaTramiteId(offerta_ricevuta.id_offerta_ricevuta).subscribe(((data:any) => {

      console.log("Risposta da deleteOffertaTramiteId(..):");
      console.log(data);
      if(data == "Offerta cancellata con successo."){

        // adesso posso cancellare anche tutte le altre offerte/controfferte che hanno l'id_start_offerta_da_cancellare:
        this.gestioneScambiService.deleteOffertaTramiteIdStart(id_start_offerta_da_cancellare).subscribe(((data_2:any) =>{
          console.log("Risposta da deleteOffertaTramiteIdStart(..):");
          console.log(data_2);
          this.openDialog("Il rifiuto si è concluso con successo!" , "OFFERTA RIFIUTATA CON SUCCESSO!");
        }))
      }
      else{
        this.openDialog("Errore: Non è stato possibile rifiutare l\'Offerta selezionata!" , "Non esiste nessuna offerta con questo id!");
      }

    }))

  }



  async controfferta(offerta_ricevuta: any){

    console.log("Click su controfferta !!");
    console.log("offerta_ricevuta IN pagina-scambi-carte: ")
    console.log(offerta_ricevuta);

    // const navigationExtras: NavigationExtras = {
    //   queryParams: {parametro: offerta_ricevuta}
    // };


    if(offerta_ricevuta.statoOfferta != "controfferta" || this.isPari(offerta_ricevuta.numControfferta)) {
      // setto la variabile condivisa con l'offerta_ricevuta selezionata, in questo modo la pagina
      // "/dashboard/fai_controfferta" potrà utilizzarla:
      this.sharedDataService.setOffertaRicevuta(offerta_ricevuta);
      this.sharedDataService.setLista_carte_artisti_utente_ricevuta(this.lista_carte_artisti_utente_ricevuta);
      this.sharedDataService.setLista_carte_brani_utente_ricevuta(this.lista_carte_brani_utente_ricevuta);

      // vado alla pagina "fai_controfferta" passandogli l'offerta_ricevuta
      // (la carta richiesta non può essere cambiata ma potranno essere modificate solo le carte offerte e i points:
      this.router.navigate(["/dashboard/fai_controfferta"]);
    }
    else if(offerta_ricevuta.statoOfferta == "controfferta" || !this.isPari(offerta_ricevuta.numControfferta)){

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const artisteResponse = await this.show.getCarteArtistaByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)
      const branoResponse = await this.show.getCarteBranoByNickname(offerta_ricevuta.nicknameU1).toPromise(); // chiamata sincrona (senza .subscribe)

      // Gestisci la risposta da getCarteArtistaByNickname
      // @ts-ignore
      this.lista_carte_artisti_utente_ricevuta = Object.keys(artisteResponse).map((key) => artisteResponse[key]);
      console.log("this.lista_carte_artisti_utente_loggato DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_ricevuta);

      // Gestisci la risposta da getCarteBranoByNickname
      // @ts-ignore
      this.lista_carte_brani_utente_ricevuta = Object.keys(branoResponse).map((key) => branoResponse[key]);
      console.log("this.lista_carte_brani_utente_loggato DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_ricevuta);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const artisteResponse_2 = await this.show.getCarteArtistaByNickname(offerta_ricevuta.nicknameU2).toPromise(); // chiamata sincrona (senza .subscribe)
      const branoResponse_2 = await this.show.getCarteBranoByNickname(offerta_ricevuta.nicknameU2).toPromise(); // chiamata sincrona (senza .subscribe)

      // Gestisci la risposta da getCarteArtistaByNickname
      // @ts-ignore
      this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(artisteResponse_2).map((key) => artisteResponse_2[key]);
      console.log("this.Lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);

      // Gestisci la risposta da getCarteBranoByNickname
      // @ts-ignore
      this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta = Object.keys(branoResponse_2).map((key) => branoResponse_2[key]);
      console.log("this.Lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




      // setto la variabile condivisa con l'offerta_ricevuta selezionata, in questo modo la pagina
      // "/dashboard/fai_controfferta" potrà utilizzarla:
      this.sharedDataService.setOffertaRicevuta(offerta_ricevuta);
      this.sharedDataService.setLista_carte_artisti_utente_ricevuta(this.lista_carte_artisti_utente_ricevuta);
      this.sharedDataService.setLista_carte_brani_utente_ricevuta(this.lista_carte_brani_utente_ricevuta);
      this.sharedDataService.setLista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta(this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);
      this.sharedDataService.setLista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta(this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);

      // vado alla pagina "fai_controfferta" passandogli l'offerta_ricevuta
      // (la carta richiesta non può essere cambiata ma potranno essere modificate solo le carte offerte e i points:
      this.router.navigate(["/dashboard/fai_controfferta"]);
    }
    else{
      // CASO IN CUI: offerta_ricevuta.statoOfferta == "controfferta" || this.isPari(offerta_ricevuta.numControfferta)

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      const artisteResponse = await this.show.getCarteArtistaByNickname(offerta_ricevuta.nicknameU2).toPromise(); // chiamata sincrona (senza .subscribe)
      const branoResponse = await this.show.getCarteBranoByNickname(offerta_ricevuta.nicknameU2).toPromise(); // chiamata sincrona (senza .subscribe)

      // Gestisci la risposta da getCarteArtistaByNickname
      // @ts-ignore
      this.lista_carte_artisti_utente_ricevuta = Object.keys(artisteResponse).map((key) => artisteResponse[key]);
      console.log("this.lista_carte_artisti_utente_loggato DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_ricevuta);

      // Gestisci la risposta da getCarteBranoByNickname
      // @ts-ignore
      this.lista_carte_brani_utente_ricevuta = Object.keys(branoResponse).map((key) => branoResponse[key]);
      console.log("this.lista_carte_brani_utente_loggato DELL'UTENTE CHE HA INVIATO L'OFFERTA in onOfferteRicevuteSectionActivated(): ", this.lista_carte_artisti_utente_ricevuta);
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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



      // setto la variabile condivisa con l'offerta_ricevuta selezionata, in questo modo la pagina
      // "/dashboard/fai_controfferta" potrà utilizzarla:
      this.sharedDataService.setOffertaRicevuta(offerta_ricevuta);
      this.sharedDataService.setLista_carte_artisti_utente_ricevuta(this.lista_carte_artisti_utente_ricevuta);
      this.sharedDataService.setLista_carte_brani_utente_ricevuta(this.lista_carte_brani_utente_ricevuta);
      this.sharedDataService.setLista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta(this.lista_carte_artisti_utente_che_ha_inviato_la_controfferta_ricevuta);
      this.sharedDataService.setLista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta(this.lista_carte_brani_utente_che_ha_inviato_la_controfferta_ricevuta);

      // vado alla pagina "fai_controfferta" passandogli l'offerta_ricevuta
      // (la carta richiesta non può essere cambiata ma potranno essere modificate solo le carte offerte e i points:
      this.router.navigate(["/dashboard/fai_controfferta"]);
    }



  }


  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
    dialogRef.afterClosed().subscribe(() => {

      // Simula il ricaricamento del componente
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.sharedDataService.setNuovaSezione('Offerte-ricevute');
      this.router.navigate(["/dashboard/scambi_carte"]);
    });
  }

  isPari(numero: number): boolean {
    return numero % 2 === 0;
  }

}
