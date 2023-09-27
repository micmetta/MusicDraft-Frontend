import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {MazzoService} from "../../servizi/mazzi/salva/salva-mazzi.service";
import {NavigationExtras, Router} from "@angular/router";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";
import {MatchmakingServiceService} from "../../servizi/matchmaking_service/matchmaking-service.service";
import {MatDialog} from "@angular/material/dialog";
import {MatchingpopComponent} from "../../popup/matchingpop/matchingpop.component";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";

@Component({
  selector: 'app-pagina-matchmaking',
  templateUrl: './pagina-matchmaking.component.html',
  styleUrls: ['./pagina-matchmaking.component.css']
})
export class PaginaMatchmakingComponent implements OnInit{

  // @ts-ignore
  nickname_user_logged: string; // contiene il nickname dell'utente
  decks: any; // I tuoi mazzi di carte
  deck: any ; // Il mazzo in fase di modifica o aggiunta
  visualizza_mazzi: boolean = false;
  availableCards: any[]=[];
  private baseUrl2 = 'http://localhost:9092/api/v1/cartemazzi';
  selectedCardToAdd: any | undefined;
  selectedDeck: any;
  nomemazoattuale:any;
  c: any[] = [];
  selectedSection: string = 'Cerca-partita'; // Sezione predefinita selezionata 'Cerca-partita'
  partite_senza_match_utente_loggato: any[] = []
  partite_concluse_utente_loggato: any[] = []

  listaDiDIzionari_carte_mazzo_U1_partite_concluse: {
    lista_info_carte_associate_mazzo_U1: any;
  }[] = [];
  listaDiDIzionari_carte_mazzo_U2_partite_concluse: {
    lista_info_carte_associate_mazzo_U2: any;
  }[] = [];

  apiurl2=`${this.baseUrl2}/getUserArtista`
  apiurl3=`${this.baseUrl2}/getUserBrano`


  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private http: HttpClient,
              private show: ShowCarteInVenditaService,
              private nick: Nickname_and_email_user_loggedService,
              private mazzoService: MazzoService,
              private router: Router,
              private sharedDataService: SharedDataService,
              private matchmakingService: MatchmakingServiceService,
              private dialog:MatDialog) {
    this.selectedCardToAdd = undefined
  }

  ngOnInit(): void {

    const apiUrl = `${this.baseUrl2}/showMazzi/${this.nick.getStoredNickname_user_logged()}`;
    const apiurl2=`${this.baseUrl2}/getUserArtista`
    const apiurl3=`${this.baseUrl2}/getUserBrano`

    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged(); // prendo il nickname dell'utente loggato in questo momento

    this.http.get<any[]>(apiUrl)
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


    // riempio tutta la lista delle partite non abbinate per l'utente loggato:
    this.matchmakingService.getAllPartiteSenzaMatch(this.nickname_user_logged).subscribe(data => {
      console.log("risposta ottenuta dal backend per getAllPartiteSenzaMatch:");
      console.log(data);
      for (const partita of data) {
        if(partita.nicknameU1 == this.nickname_user_logged){
          this.partite_senza_match_utente_loggato.push(partita);
        }
      }
    })


    // riempio tutta la lista di partite che si sono concluse e che sono state giocate dell'utente loggato:
    this.matchmakingService.getAllPartiteConcluse(this.nickname_user_logged).subscribe(data => {
      console.log("risposta ottenuta dal backend per getAllPartiteConcluse:");
      console.log(data);
      for (const partita_conclusa of data) {
        this.partite_concluse_utente_loggato.push(partita_conclusa);
      }

      console.log("this.partite_concluse_utente_loggato: ");
      console.log(this.partite_concluse_utente_loggato);

      // per ogni partita conclusa prendo gli id delle carte di entrambi i giocatori e mi salvo le loro informazioni:
      for (const partita_conclusa of data) {

        let id_carteAssociateMazzoU1: any[] = []
        let id_carteAssociateMazzoU2: any[] = []
        id_carteAssociateMazzoU1 = this.convertStringToArray(partita_conclusa.carteAssociateMazzoU1);
        id_carteAssociateMazzoU2 = this.convertStringToArray(partita_conclusa.carteAssociateMazzoU2);
        console.log("id_carteAssociateMazzoU1: ", id_carteAssociateMazzoU1);
        console.log("id_carteAssociateMazzoU2: ", id_carteAssociateMazzoU2);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Prendo le info delle carte di U1
        let lista_info_carte_associate_mazzo_U1: any[] = []
        for (const id_carta_associata of id_carteAssociateMazzoU1) {

          // Per ogni carta mi collego al backend e mi prendo le sue info
          console.log()
          console.log("id carta di " + partita_conclusa.nicknameU1 + id_carta_associata)

          this.http.get<any>(apiurl2+`/${id_carta_associata}`)
            .subscribe(
              (data: any) => {
                if(data.length!=0) {
                  // allora la carta è di tipo artista ed è stata trovata:
                  console.log("info carta Artista: ", data)
                  lista_info_carte_associate_mazzo_U1.push(data);
                }
                else{
                  this.http.get<any>(apiurl3+`/${id_carta_associata}`) // vedo se è di tipo brano
                    .subscribe(
                      (data: any) => {
                        if(data != null) {
                          // allora la carta è di tipo artista ed è stata trovata:
                          console.log("info carta Brano: ", data)
                          lista_info_carte_associate_mazzo_U1.push(data);
                        }}
                    );
                }
              }
            );
        }
        let nuovoElemento = {
          lista_info_carte_associate_mazzo_U1: lista_info_carte_associate_mazzo_U1
        }
        this.listaDiDIzionari_carte_mazzo_U1_partite_concluse.push(nuovoElemento); // inserisco la lista nella lista di dizionari
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Prendo le info delle carte di U2
        let lista_info_carte_associate_mazzo_U2: any[] = []
        for (const id_carta_associata of id_carteAssociateMazzoU2) {

          // Per ogni carta mi collego al backend e mi prendo le sue info
          console.log()
          console.log("id carta di " + partita_conclusa.nicknameU2 + id_carta_associata)

          this.http.get<any>(apiurl2+`/${id_carta_associata}`)
            .subscribe(
              (data: any) => {
                if(data.length!=0) {
                  // allora la carta è di tipo artista ed è stata trovata:
                  console.log("info carta Artista: ", data)
                  lista_info_carte_associate_mazzo_U2.push(data);
                }
                else{
                  this.http.get<any>(apiurl3+`/${id_carta_associata}`) // vedo se è di tipo brano
                    .subscribe(
                      (data: any) => {
                        if(data != null) {
                          // allora la carta è di tipo artista ed è stata trovata:
                          console.log("info carta Brano: ", data)
                          lista_info_carte_associate_mazzo_U2.push(data);
                        }}
                    );
                }
              }
            );
        }
        let nuovoElemento_2 = {
          lista_info_carte_associate_mazzo_U2: lista_info_carte_associate_mazzo_U2
        }
        this.listaDiDIzionari_carte_mazzo_U2_partite_concluse.push(nuovoElemento_2); // inserisco la lista nella lista di dizionari
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      }
    })
  }


  selectSection(section: string) {
    this.selectedSection = section;
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



  visualizzaMazzo(deck: any){
    console.log("Click su visualizzaMazzo!!")

    // setto il deck selezionato nella variabile condivisa:
    this.sharedDataService.setDeck(deck);

    // vado alla pagina per visualizzare il mazzo
    this.router.navigate(["/dashboard/visualizza_mazzo"]);
  }



  schieraMazzo(deck: any){

    console.log("Click su schieraMazzo!!")
    console.log("deck:");
    console.log(deck);

    // setto il deck selezionato, con il quale l'utente loggato ha deciso di giocare la partita, nella variabile condivisa:
    this.sharedDataService.setDeck(deck);

    // chiamo il backend per cercare la partita:

    // 1) prima invoco "/cercaMatch":

    // creo l'oggetto che manderò nel body:
    let popolarita_mazzo: number = 0;
    let somma_pop: number = 0;
    for (const carta of deck.carteassociate) {
      // console.log("carta: ", carta)
      // console.log("carta.popolarita: ", carta[0].popolarita)
      somma_pop = somma_pop + carta[0].popolarita;
    }
    popolarita_mazzo = somma_pop/5 // faccio la media
    this.sharedDataService.setPopolarita_mazzo(popolarita_mazzo); // setto la variabile condivisa che contieve il valore della pop del mazzo selezionato per la partita


    console.log("this.nickname_user_logged: ", this.nickname_user_logged)
    console.log("deck.nomemazzo: ", deck.nomemazzo)
    console.log("popolarita_mazzo: ", popolarita_mazzo)

    this.matchmakingService.putCercaMatch(
      {
        nicknameGiocatore: this.nickname_user_logged,
        nomemazzoGiocatore: deck.nomemazzo,
        popolaritaMazzoGiocatore: popolarita_mazzo
      }
    ).subscribe(data => {
      console.log("Risposta deel backend per CercaMatch: ", data);

      // In base alla risposta ottenuta dal backend saprò se c'è stato un matching oppure no
      if(data == "Matching trovato."){
        // Il backend avrà già inserito nella tabella dei riempiloghi dell'utente loggato la partita appena conclusa..
        // Quindi avverto l'utente che è stato matchato con un altro giocatore e che può visualizzare il risultato finale della partita nella sezione "Riepilogo partite":

        // riaggiorno la pagina per essere sicuro che che in riepilogoPartite ci sarà anche la partita appena conclusa:
        // Eseguo il ricaricamento del componente in modo tale da avere anche la sezione "Partite non abbinate" riaggiornata.
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/dashboard/matchmaking"]);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.openDialog('Matching avvenuto con Successo', 'Sei stato matchato con un altro utente, per visualizzare il risultato della partita vai nella sezione - Riepilogo partite -');
      }
      else{
        // allora avverto l'utente che NON è stato matchato con un altro giocatore e quindi
        // è stato messo in attesa che un altro giocatore del suo livello
        // cerchi una partita.
        // Potrà visualizzare la lista di partite nelle quali è in attesa nella sezione "Partite non abbinate":

        const dialogRef = this.dialog.open(MatchingpopComponent, {});
        dialogRef.afterClosed().subscribe(data => {
          console.log("data DENTRO dialogRef.afterClosed().subscribe: ", data)
        });
      }

    })

  }



  // questo metodo elimina una certa partita nella quale l'utente loggato era in attesa
  elimina(partita: any){
    console.log("partita in elimina: ", partita)
    this.matchmakingService.deleteCancellaPartita(partita.id).subscribe(data => {
      if(data == "Partita cancellata con successo."){
        // const nuovaLista = listaOggetti.filter((oggetto) => oggetto.id !== idDaCancellare);
        let id_da_cancellare = partita.id;
        this.partite_senza_match_utente_loggato = this.partite_senza_match_utente_loggato.filter((partita) => partita.id !== id_da_cancellare);
        this.openDialog('Cancellazione attesa effettuata con successo', 'La partita nella quale eri in attesa è stata eliminata!');
      }
      else{
        this.openDialog('Errore durante cancellazione attesa', 'L\'id della partita non esiste.');
      }
    })

  }

  get_tipo(carta: any): string{
    if(carta.hasOwnProperty('durata')){
      return "brano";
    }
    else{
      return "artista";
    }
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

  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
  }


}
