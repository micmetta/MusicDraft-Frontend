import {Component, OnInit} from '@angular/core';
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pagina-home',
  templateUrl: './pagina-home.component.html',
  styleUrls: ['./pagina-home.component.css']
})
export class PaginaHomeComponent implements OnInit{

  // @ts-ignore
  nickname_user_logged: String; // contiene il nickname dell'utente

  // @ts-ignore
  email_user_logged: String; // contiene l'email dell'utente

  points_user: number = 0; // conterrà i points dell'utente

  // @ts-ignore
  private subscription: Subscription;

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService, private authService: AuthService) {
  }

  ngOnInit(): void {
    // this.subscription = this.nicknameAndEmailUserLoggedService.nickname_user_logged$.subscribe(value => {
    //   this.nickname_user_logged = value;
    // });
    //
    // this.subscription = this.nicknameAndEmailUserLoggedService.email_user_logged$.subscribe(value => {
    //   this.email_user_logged = value;
    // });

    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged();
    this.nicknameAndEmailUserLoggedService.nickname_user_logged$.subscribe(value => {
      this.nickname_user_logged = value;
    })

    this.email_user_logged = this.nicknameAndEmailUserLoggedService.getStoredEmail_user_logged();
    this.nicknameAndEmailUserLoggedService.email_user_logged$.subscribe(value => {
      this.email_user_logged = value;
    })

    // Prendo i points dell'utente:
    this.authService.getPoints(this.nickname_user_logged).subscribe(data => {
      this.points_user = Number(data);
    })
  }

  aggiungi_points(){
    this.authService.updatePoints(this.nickname_user_logged, 10).subscribe(data => {})
  }


  // ADESSO DEVI INSERIRE NEL FRONTEND LA POSSIBILITA' DI CLICCARE SU LISTA AMICI e:
  // - vedere tutti gli amici,
  // - tutte le loro carte,
  // - possibilità di fare un'offerta per una certa carta,
  // - visualizzare tutte le offerte in corso e il loro storico.


}
