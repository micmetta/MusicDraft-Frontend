import { Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  nick_mail = ''
  password = '';
  hide = true;
  loginFormValid = false;
  type_login: string = "";
  loginFailed = false;
  user!: SocialUser;
  nickname_user_logged: string = "";
  email_user_logged: string = "";

  // PROVA A RICHIAMARE IL SERVIZIO DI GOOGLE IN UN ALTRO COMPONENTE A PARTE PROVANDO A FARE QUELLO CHE FA IL RAGAZZO NEL COSTRUTTORE...

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const nickname_or_email = this.nick_mail
    const password = this.password

    console.log(nickname_or_email, password) // stampo in console i 2 valori dei parametri inseriti

    // chiamare il metodo presente in auth.service che chiamerà il tuo microservizio backend che si preoccupa
    // di controllare se nickname_or_email e password sono presenti nel DB user.
    this.authService.signIn(nickname_or_email, password).subscribe(data => {

      //console.log("data: ")
      console.log(typeof data) // data in questo caso è una stringa
      console.log("data: ", data)

      this.type_login = JSON.stringify(data);
      console.log("this.type_login: ", this.type_login)

      if(this.type_login == JSON.stringify("nickname") || this.type_login == JSON.stringify("email")){

        // con l'if-else di sotto mi salvo il nickname o l'email in base a quello che l'utente ha inserito nel login
        if(this.type_login == JSON.stringify("nickname")){
          this.nickname_user_logged = nickname_or_email
          // richiedo l'email dell'utente chiamando il backend
        }
        else{
          this.email_user_logged = nickname_or_email
          // richiedo il nickname dell'utente chiamando il backend
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
}
