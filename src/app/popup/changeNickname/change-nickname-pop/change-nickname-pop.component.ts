import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogMessageComponent} from "../../../componenti/dialog-message/dialog-message.component";
import {AuthService} from "../../../auth/auth.service";
import {
  Nickname_and_email_user_loggedService
} from "../../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";

@Component({
  selector: 'app-change-nickname-pop',
  templateUrl: './change-nickname-pop.component.html',
  styleUrls: ['./change-nickname-pop.component.css']
})
export class ChangeNicknamePopComponent {

  nickname_user_logged: string = '';
  newNickname: string = '';

  constructor(
    private autService:AuthService,
    private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
    public dialogRef: MatDialogRef<ChangeNicknamePopComponent>,
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { currentNickname: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {

    if(this.newNickname == ''){
      this.newNickname = '0'; // lo setto a 0 per far capire a pagina-account.component.ts che il nickname inserito è vuoto
      this.openDialog('Errore: nickname vuoto', 'Non puoi usare un nickname vuoto!');
      this.dialogRef.close(this.newNickname);
    }
    else{
      // chiamo il backend per essere certo che questo nuovo nickname sia univoco:
      this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged(); // prendo il nickname dell'utente loggato in questo momento
      this.autService.putNewNickname(this.nickname_user_logged, this.newNickname).subscribe(data => {

        console.log("Risposta dal backend per il cambio nickname: ", data)

        if(data == "Il nuovo nickname è stato settato correttamente."){
          this.openDialog('Nickname inserito correttamente', 'Il tuo nickname è stato aggiornato con successo!');
          this.dialogRef.close(this.newNickname);
        }
        else if(data == "Il nuovo nickname che si vuole registrare esiste già."){
          this.newNickname = '-1'; // lo setto a -1 per far capire a pagina-account.component.ts che il nickname inserito esiste già
          this.openDialog('Nickname già esistente', 'Il nickname che hai inserito esiste già!');
          this.dialogRef.close(this.newNickname);
        }
        else{
          this.newNickname = '-2'; // lo setto a -2 per far capire a pagina-account.component.ts che il nickname dell'utente loggato è inesistente nel DB (risp backend: "nickname corrente inesistente")
          this.openDialog('Errore: Nickname corrente inesistente', 'Il tuo nickname non è presente nel database!');
          this.dialogRef.close(this.newNickname);
        }
      })
    }
  }



  openDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(DialogMessageComponent, {
      data: { title, message }
    });
  }

}
