import { Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {Subscription} from "rxjs";
import {FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nick_mail = ''
  password = '';
  hide = true;
  loginFormValid = false;
  type_login: string = "";
  loginFailed = false;
  user!: SocialUser;
  // nickname_user_logged: string = "";
  // email_user_logged: string = "";
  // @ts-ignore
  nickname_user_logged: String;
  // @ts-ignore
  email_user_logged: String;
  // @ts-ignore
  private subscription: Subscription;

  nick_mailFormControl = new FormControl('', [Validators.required]);

  // PROVA A RICHIAMARE IL SERVIZIO DI GOOGLE IN UN ALTRO COMPONENTE A PARTE PROVANDO A FARE QUELLO CHE FA IL RAGAZZO NEL COSTRUTTORE...

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService, private authService: AuthService, private authServiceSocial: SocialAuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authServiceSocial.authState.subscribe((user)=>{
      this.user = user;
    })
  }

  onSubmit(){
    const nickname_or_email = this.nick_mail
    const password = this.password

    console.log("nickname_or_email:")
    console.log(nickname_or_email) // stampo in console i 2 valori dei parametri inseriti

    console.log("password:")
    console.log(password)


    ////////// chiamata al backend ////////////////
    // chiamare il metodo presente in auth.service che chiamerà il tuo microservizio backend che si preoccupa
    // di controllare se nickname_or_email e password sono presenti nel DB user.
    this.authService.signIn(nickname_or_email, password).subscribe(data => {
    //////////////////////////////////////////////

      //console.log("data: ")
      console.log(typeof data) // data in questo caso è una stringa
      console.log("data: ", data)

      this.type_login = JSON.stringify(data);
      console.log("this.type_login: ", this.type_login)

      if(this.type_login == JSON.stringify("nickname") || this.type_login == JSON.stringify("email")){

        // con l'if-else di sotto mi salvo il nickname o l'email in base a quello che l'utente ha inserito nel login:
        if(this.type_login == JSON.stringify("nickname")){

          ////////// chiamata al backend ////////////////
          // in questo caso richiedo l'email dell'utente chiamando il backend perchè so che nel login ha inserito il suo nickname e non l'email:
          this.authService.getEmail(nickname_or_email).subscribe(data => {
            //this.email_user_logged = JSON.stringify(data);
            this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(nickname_or_email);
            this.nicknameAndEmailUserLoggedService.updateEmail_user_logged(JSON.stringify(data));
          })
          //////////////////////////////////////////////
        }
        else{
          ////////// chiamata al backend ////////////////
          // in questo caso richiedo il nickname dell'utente chiamando il backend e passandogli l'email:
          this.authService.getNickname(nickname_or_email).subscribe(data => {
            this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(JSON.stringify(data));
            this.nicknameAndEmailUserLoggedService.updateEmail_user_logged(nickname_or_email);
          })
          //////////////////////////////////////////////
        }


        this.router.navigate(["/dashboard/home"])
        this.loginFailed = false;
      }
      else{
        // vuol dire che l'utente ha inserito dati sbagliati o nel campo nickname_or_email oppure nel campo password..
        console.log("DATI INSERITI ERRATI.")
        this.loginFailed = true;
      }

    })
    //form.reset()

  }

  togglePasswordVisibility(): void {
    //event.stopPropagation();
    this.hide = !this.hide;
  }

  checkLoginFormValidity() {
    this.loginFormValid = !!this.nick_mail && !!this.password;
  }

  vaiSuCreaAccount(){
    this.router.navigate(["/registrazione"])
  }



  signInWithGoogle(): any{ // For SignUp
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(response => {
        this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(response.name);
        this.nicknameAndEmailUserLoggedService.updateEmail_user_logged(response.email);
        this.nick_mail = response.name;
        console.log("this.nick_mail IN signInWithGoogle:")
        console.log(this.nick_mail)
      })
      .catch(error => {
        console.error("Si è verificato un errore durante la registrazione con Google.");
      })
  }

}
