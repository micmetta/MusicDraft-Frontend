import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private authService: AuthService, private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService, private router: Router) {}

  onLogout(){
    // pulisco il local storage e setto isLoggedIn a false e inoltre setto lo stato dell'utente corrente su Offline
    this.authService.logout(this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged()).subscribe(data => {
      console.log("Risposta ottenuta dal backend dopo aver settato a false lo stato dell'utente corrente: ");
      console.log(data);
      this.router.navigate([""]); // infine riporto l'utente che ha appena fatto il logout alla HOMEPAGE dell'applicazione.
    })
  }
}
