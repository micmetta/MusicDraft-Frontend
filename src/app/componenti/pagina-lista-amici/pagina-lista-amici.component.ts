import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";
import {GestioneScambiService} from "../../servizi/home_service/gestione-scambi.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pagina-lista-amici',
  templateUrl: './pagina-lista-amici.component.html',
  styleUrls: ['./pagina-lista-amici.component.css']
})
export class PaginaListaAmiciComponent implements OnInit{


  selectedSection: string = 'Lista-amici'; // Sezione predefinita selezionata 'Amici'
  nickname: string = ''; // Variabile per memorizzare il nickname inserito dall'utente
  // @ts-ignore
  nickname_user_logged: string; // contiene il nickname dell'utente
  lista_amici: any[] = [];
  lista_stato_amici: any[] = [];
  lista_users_app: any[] = [];
  lista_richieste_amicizia_ricevute: any[] = []


  constructor(private dialog:MatDialog,
              private authService: AuthService,
              private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private gestioneScambiService: GestioneScambiService,
              private router: Router,) {}

  ngOnInit(): void {
    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged();

    // carico tutta la lista amici dell'utente loggato:
    this.gestioneScambiService.getAllFriends(this.nickname_user_logged).subscribe(data => {
      this.lista_amici = data;
      console.log("this.lista_amici:")
      console.log(this.lista_amici)

      // per ogni amico vedo qualè il suo stato e me lo salvo in lista_stato_amici:
      for (const nickAmico of this.lista_amici) {
          let stato = "";

          this.authService.getIsOnline(nickAmico).subscribe(data => {
            stato = data;
            if(stato == "Online"){
              this.lista_stato_amici.push("Online");
            }
            else{
              this.lista_stato_amici.push("Offline");
            }
        })
      }
    })


    // carico tutti gli utenti presenti nella tabella utenti
    this.authService.getAllUsers().subscribe(data => {
      this.lista_users_app = data;
      console.log("this.lista_users_app:");
      console.log(this.lista_users_app);
    })

    // carico tutte le richieste di amicizia ricevute dall'utente loggato:
    this.gestioneScambiService.getAllRichiesteRicevuteEinAttesa(this.nickname_user_logged).subscribe(data => {
      this.lista_richieste_amicizia_ricevute = data;
      console.log("this.lista_richieste_amicizia_ricevute:");
      console.log(this.lista_richieste_amicizia_ricevute);
    })


  }

  selectSection(section: string) {
    this.selectedSection = section;
  }

  inviaRichiesta(nickname: string) {

    console.log("this.nickname_user_logged: ", this.nickname_user_logged)
    console.log("nickname: ", nickname)

    if(nickname == ''){
      // il campo non può essere vuoto
      this.openDialog('Non hai inserito nulla nel campo nickname', 'Non è stato inserito nessun nickname!');
    }
    else{
      // chiamo il backend per mandare la richiesta di amicizia
      this.gestioneScambiService.postInviaRichiestaAmico(this.nickname_user_logged, nickname).subscribe(data => {

        console.log("Risposta ottenuta dall'invio della richiesta di amicizia:")
        console.log(data)

        if(data == "L'utente che si vuole aggiungere non esiste."){
          this.openDialog('Non hai inserito un nickname valido', 'L\'utente che si vuole aggiungere non esiste!');
        }
        else if(data == "Non puoi inviare una richiesta di amicizia a te stesso!"){
          this.openDialog('Hai inserito il tuo nickname', 'Non puoi inviare una richiesta di amicizia a te stesso!');
        }
        else if(data == "Sei già amico di questo utente."){
          this.openDialog("L\'utente che hai inserito è già tuo amico", "Sei già amico di questo utente!");
        }
        else if(data == "Richiesta di amicizia già inviata, attendi che l'altro utente risponda."){
          this.openDialog("Hai già inviato una richiesta a questo utente", "Richiesta di amicizia già inviata, attendi che l'altro utente risponda!");
        }
        else{
          this.openDialog("Richiesta inviata con successo", "Richiesta inviata a " + nickname + "!");
        }
      })
    }

    // Puoi aggiungere qui la logica per inviare la richiesta di amicizia
    // console.log(`Richiesta di amicizia inviata a nickn`);

    // // Resetta il valore dell'input dopo l'invio
    // this.nickname = '';
  }

  accettaRichiesta(nickname_user_inviato_richiesta: string){
    this.gestioneScambiService.putAccettaRichiestaAmiciza(nickname_user_inviato_richiesta, this.nickname_user_logged).subscribe(data => {

      console.log("Risposta del backend dopo aver accettato la richiesta di amicizia: ", data);
      if(data == "richiesta accettata."){

        // riaggiorno la pagina in modo tale che la richiesta appena accettata scompaia dalla schermata:
        // Simula il ricaricamento del componente
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/dashboard/lista amici"]);

        this.openDialog("Richiesta accetta con successo", "Adesso tu e " + nickname_user_inviato_richiesta + " siete amici!");

      }
      else if(data == "La richiesta di amicizia è già stata accettata."){
        this.openDialog("La richiesta di amicizia è già stata accettata", "Tu e " + nickname_user_inviato_richiesta + " siete già amici!");
      }
      else{
        this.openDialog("Errore: si è verificato un errore durante l'accettazione della richiesta perchè - amiciziaDaAccettare - è null.", "Non è stato possibile accettare la richiesta!");
      }
    })
  }


  rifiutaRichiesta(nickname_user_inviato_richiesta: string){
    this.gestioneScambiService.deleteRifiutaRichiestaAmiciza(nickname_user_inviato_richiesta, this.nickname_user_logged).subscribe(data => {

      console.log("Risposta del backend dopo aver rifiutato la richiesta di amicizia: ", data);
      if(data == "richiesta rifiutata."){

        // riaggiorno la pagina in modo tale che la richiesta appena accettata scompaia dalla schermata:
        // Simula il ricaricamento del componente
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/dashboard/lista amici"]);
        this.openDialog("Richiesta rifiutata con successo", "Adesso tu e " + nickname_user_inviato_richiesta + " non siete più amici!");
      }
      else if(data == "La richiesta di amicizia è già stata rifiutata."){
        this.openDialog("La richiesta di amicizia è già stata rifiutata", "Tu e " + nickname_user_inviato_richiesta + " non sarete amici!");
      }
      else{
        this.openDialog("Errore: si è verificato un errore durante il rifiuto della richiesta perchè - amiciziaDaRifiutare - è null.", "Non è stato possibile rifiutare la richiesta!");
      }
    })
  }

  cancellaAmicizia(nickname_user_cancella_amicizia: string){
    this.gestioneScambiService.deleteCancellaAmicizia(nickname_user_cancella_amicizia, this.nickname_user_logged).subscribe(data => {

      console.log("Risposta del backend dopo aver cancellato l'amicizia: ", data);
      if(data == "amicizia cancellata."){

        // riaggiorno la pagina in modo tale che la richiesta appena accettata scompaia dalla schermata:
        // Simula il ricaricamento del componente
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/dashboard/lista amici"]);
        this.openDialog("Amicizia cancellata con successo", "Adesso tu e " + nickname_user_cancella_amicizia + " non siete più amici!");
      }
      else if(data == "Tu e questo utente già non siete amici."){
        this.openDialog("Amicizia inesistente", "Tu e " + nickname_user_cancella_amicizia + " già non siete amici!");
      }
      else{
        this.openDialog("Errore: si è verificato un errore durante la cancellazione dell'amicizia perchè - amiciziaDaCancellare e amiciziaDaCancellare_contrario- sono null.", "Non è stato possibile cancellare l'amicizia!");
      }
    })
  }






  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
  }


}
