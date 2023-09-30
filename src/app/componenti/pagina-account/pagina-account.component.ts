import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogMessageComponent} from "../dialog-message/dialog-message.component";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {ChangeNicknamePopComponent} from "../../popup/changeNickname/change-nickname-pop/change-nickname-pop.component";
import {ChangePasswordPopComponent} from "../../popup/changePassword/change-password-pop/change-password-pop.component";

@Component({
  selector: 'app-pagina-account',
  templateUrl: './pagina-account.component.html',
  styleUrls: ['./pagina-account.component.css']
})
export class PaginaAccountComponent implements OnInit{


  nickname_user_logged: string = '';
  password_user_logged: string = '';

  constructor(private autService:AuthService,
              private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private dialog:MatDialog) {}


  ngOnInit(): void {

    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged(); // prendo il nickname dell'utente loggato in questo momento
    this.autService.getUser(this.nickname_user_logged).subscribe(data => {
      console.log("risposta backend dopo invocazione this.autService.getUser:");
      console.log(data);
      this.password_user_logged = data.password; // prendo la password corrente
    })

  }


  setNewNickname(nicknameCurrent: string, nicknameNew: string){
    this.autService.putNewNickname(nicknameCurrent, nicknameNew).subscribe(data => {
      console.log("risp backend dopo putNewNickname: ", data)
      if(data == "Il nuovo nickname è stato settato correttamente."){
        this.openDialog('Cambio nickname effettuato con successo', 'Il nuovo nickname è stato settato correttamente!');
      }
      else{
        this.openDialog('Nickname già esistente', 'Il nuovo nickname che si vuole registrare esiste già!');
      }
    })
  }

  setNewPassword(nickname: string, passwordNew: string){
    this.autService.putNewPassword(nickname, passwordNew).subscribe(data => {
      console.log("risp backend dopo putNewPassword: ", data)
      if(data == "La nuova password è stata settata correttamente"){
        this.openDialog('Cambio password effettuato con successo', 'La nuova password è stata settata correttamente!');
      }
      else{
        this.openDialog('Errore: Nickname corrente inesistente', 'Il tuo nickname non è presente nel database!');
      }
    })
  }


  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  openChangeNicknameDialog(): void {
    const dialogRef = this.dialog.open(ChangeNicknamePopComponent, {
      width: '250px',
      data: { currentNickname: this.nickname_user_logged },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if((result != '0') && (result != '-1') && (result != '-2')){
          this.nickname_user_logged = result; // lo cambio solo se il nuovo nickname inserito non è vuoto, è univoco e l'utente loggato esiste nel database.
          // cambio nel localStorage il nickname dell'utente:
          this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(this.nickname_user_logged);
        }
      }
    });
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordPopComponent, {
      width: '250px',
      data: { currentNickname: this.nickname_user_logged },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if((result != '0') && (result != '-2')){
          this.password_user_logged = result; // la cambio solo se la nuova password inserita non è vuota e l'utente loggato esiste nel database.
        }
      }
    });
  }




  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
  }


}
