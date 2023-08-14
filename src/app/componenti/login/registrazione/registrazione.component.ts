import {Component, OnInit} from '@angular/core';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {AuthService} from "../../../auth/auth.service";
import {style} from "@angular/animations";
import {Router} from "@angular/router";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";

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

  constructor(private authServicce: AuthService, private authServiceSocial: SocialAuthService, private router: Router) {}

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
    // di controllare se nickname_or_email e password sono presenti nel DB user)
    this.authServicce.signUp(
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
        this.registrationFailed = false
        this.router.navigate(["/dashboard/home"])
      }
    })
  }

  togglePasswordVisibility(): void {
    //event.stopPropagation();
    this.hide = !this.hide;
  }

  signWithGoogle(): any{ // For SignIn
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // signOut(): any{ // For SignOut User
  //   this.authServiceSocial.signOut();
  // }

}
