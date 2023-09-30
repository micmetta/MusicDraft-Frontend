import {Component, Inject} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {
  Nickname_and_email_user_loggedService
} from "../../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogMessageComponent} from "../../../componenti/dialog-message/dialog-message.component";

@Component({
  selector: 'app-change-password-pop',
  templateUrl: './change-password-pop.component.html',
  styleUrls: ['./change-password-pop.component.css']
})
export class ChangePasswordPopComponent {

  nickname_user_logged: string = '';
  newPassword: string = '';


  constructor(
    private autService:AuthService,
    private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
    public dialogRef: MatDialogRef<ChangePasswordPopComponent>,
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { currentNickname: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {

    if(this.newPassword == ''){
      this.newPassword = '0'; // lo setto a 0 per far capire a pagina-account.component.ts che il nickname inserito è vuoto
      this.openDialog('Errore: password vuota', 'Non puoi usare una password vuota!');
      this.dialogRef.close(this.newPassword);
    }
    else{
      // chiamo il backend per essere certo che questo nuovo nickname sia univoco:
      this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged(); // prendo il nickname dell'utente loggato in questo momento
      this.autService.putNewPassword(this.nickname_user_logged, this.newPassword).subscribe(data => {

        console.log("Risposta dal backend per il cambio password: ", data)

        if(data == "La nuova password è stata settata correttamente"){
          this.openDialog('Password inserita correttamente', 'La tua password è stata aggiornata con successo!');
          this.dialogRef.close(this.newPassword);
        }
        else{
          this.newPassword = '-2'; // lo setto a -2 per far capire a pagina-account.component.ts che il nickname dell'utente loggato è inesistente nel DB (risp backend: "nickname corrente inesistente")
          this.openDialog('Errore: Nickname corrente inesistente', 'Il tuo nickname non è presente nel database!');
          this.dialogRef.close(this.newPassword);
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
