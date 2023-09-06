import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../../../auth/auth.service";
import {style} from "@angular/animations";
import {Router} from "@angular/router";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {
  Nickname_and_email_user_loggedService
} from "../../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit{

  nickname = '';
  email = '';
  password = '';
  passwordSmall: boolean = false;
  hide = true;
  out: string = "";
  registrationFailed = false;
  user!: SocialUser;
  nicknameFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required]);

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService, private authService: AuthService, private authServiceSocial: SocialAuthService, private router: Router) {}

  ngOnInit(): void {
    this.authServiceSocial.authState.subscribe((user)=>{
      this.user = user;
    })
  }

  onSubmit(){

    // Rimuovi gli spazi vuoti dal nickname prima di inviare il modulo
    //this.nickname = this.nickname.trim();

    const nickname = this.nickname
    const email = this.email
    const password = this.password

    // console.log(nickname, email, password) // stampo in console i 3 parametri
    console.log("nickname: ", nickname)
    console.log("email: ", email)
    console.log("password: ", password)


    // chiamare authservice (il tuo microservizio backend che si preoccupa
    // di controllare se nickname_or_email e password sono già presenti nel DB user)
    this.authService.signUp(
      {
        nickname: nickname,
        email: email,
        password: password}
    ).subscribe(data => {

      console.log("data: ")
      console.log(typeof data) // data in questo caso è un boolean
      console.log("data: ", data)

      this.out = data;
      console.log("this.out: ", this.out)

      if(this.out == "nickname non univoco" || this.out == "email non univoca"){
        this.registrationFailed = true
      }
      else{
        // aggiunto per il localStorage
        this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(this.nickname);
        this.nicknameAndEmailUserLoggedService.updateEmail_user_logged(this.email);

        this.registrationFailed = false
        this.router.navigate(["/dashboard/home"])
      }
    })
  }

  togglePasswordVisibility(): void {
    //event.stopPropagation();
    this.hide = !this.hide;
  }

  signUpWithGoogle(): any{ // For SignUp
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(response => {
        this.nicknameAndEmailUserLoggedService.updateNickname_user_logged(response.name);
        this.nicknameAndEmailUserLoggedService.updateEmail_user_logged(response.email);
        this.registrationFailed = false
      })
      .catch(error => {
        console.error("Si è verificato un errore durante la registrazione con Google.");
        this.registrationFailed = true;
      })
  }

}
