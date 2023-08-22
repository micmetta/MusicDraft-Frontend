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
  nickname_user_logged: String;
  // @ts-ignore
  email_user_logged: String;
  // @ts-ignore
  private subscription: Subscription;

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService) {
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
  }


}
