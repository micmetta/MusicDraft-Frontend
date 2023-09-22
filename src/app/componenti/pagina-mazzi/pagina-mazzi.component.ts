import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ShowCarteInVenditaService } from "../../servizi/marketplace/show-carte-in-vendita.service";
import { Nickname_and_email_user_loggedService } from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {MatChip} from "@angular/material/chips";
import {MazzoService} from "../../servizi/mazzi/salva/salva-mazzi.service";

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
  private baseUrl2 = 'http://localhost:9092/api/v1/cartemazzi';
  carteSelezionate: any[] = []; // Inizializza l'array delle carte selezionate
  selectedCardToAdd: any | undefined;
  selectedDeck: any;
  creanuovomazzo:any;
  nomemazoattuale:any;
  c: any[] = [];
  modificamazzo:any


  constructor(private http: HttpClient, private show: ShowCarteInVenditaService, private nick: Nickname_and_email_user_loggedService,private mazzoService: MazzoService) {
    this.selectedCardToAdd = undefined
  }

  ngOnInit() {
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

  salvaMazzo() {
    const set = new Set(this.carteSelezionate);
    if (this.carteSelezionate.length === 5 && (this.carteSelezionate.length == set.size)) {
      console.log(this.carteSelezionate)
      // Invia i dati al backend
      this.mazzoService.creaNuovoMazzo(this.deck.name, this.carteSelezionate,this.nick.getStoredNickname_user_logged()).subscribe(
        (response) => {
        console.log("fatto")        },
        (error) => {
          console.error('Errore durante la creazione del mazzo', error);
          // Gestisci gli errori, ad esempio, mostrando un messaggio all'utente
        }
      );
      this.isEditing = false;
      this.creanuovomazzo=false;
      this.selectedDeck=false;
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
      this.http.delete(`http://localhost:9092/api/v1/cartemazzi/deleteMazzo/${deck.nomemazzo}`)
        .subscribe((response) => {
          console.log("fatto")});

    }
  }

  annullaModifica() {
    this.isEditing = false;
    this.deck = {}; // Reimposta il mazzo in modo da cancellare i dati del form
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

  modifyDeck() {
    this.c=[]
    console.log(this.deck)
    for (const i in this.deck) {
      for (const j in this.deck[i]) {
        this.c.push(this.deck[i][j])


      }
    }

    console.log(this.c.length)
    console.log(this.deck.length)
    console.log(this.c)
    const contieneDuplicati = this.c.some((oggetto, indice, array) => {
      return array.findIndex((elemento) => elemento.id === oggetto.id) !== indice;
    });

    const set = new Set(this.c);

    if (this.c.length == 5) {
      if (!contieneDuplicati) {
        this.http.delete(`http://localhost:9092/api/v1/cartemazzi/deleteMazzo/${this.nomemazoattuale}`)
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
