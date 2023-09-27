import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatchmakingServiceService} from "../../servizi/matchmaking_service/matchmaking-service.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";

@Component({
  selector: 'app-matchingpop',
  templateUrl: './matchingpop.component.html',
  styleUrls: ['./matchingpop.component.css']
})
export class MatchingpopComponent {

  // @ts-ignore
  nickname_user_logged: string; // contiene il nickname dell'utente

  constructor(
    private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private matchmakingService: MatchmakingServiceService,
    public dialogRef: MatDialogRef<MatchingpopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  InserisciInAttesa(): void {

    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged(); // prendo il nickname dell'utente loggato in questo momento

    this.dialogRef.close(
      this.matchmakingService.postCreaNuovaPartita(
        {
          nicknameU1: this.nickname_user_logged,
          nicknameU2: "",
          nomemazzoU1: this.sharedDataService.getDeck().nomemazzo,
          nomemazzoU2: "",
          popolaritaMazzoU1: this.sharedDataService.getPopolarita_mazzo(),
          popolaritaMazzoU2: -1
        }).subscribe(data => {

        // Eseguo il ricaricamento del componente in modo tale da avere anche la sezione "Partite non abbinate" riaggiornata.
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(["/dashboard/matchmaking"]);
        console.log("Risposta backend dopo aver chiamato postCreaNuovaPartita IN MatchingpopComponent:")
        console.log(data)
        })
    );
  }

  TornaIndietro(): void {

    this.dialogRef.close(
      this.router.navigate(["/dashboard/matchmaking"])
    );
  }

}


