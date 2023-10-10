import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule} from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';

import { AppComponent } from './app.component';
import { HomepageComponent } from './componenti/homepage/homepage.component';
import { LoginComponent } from './componenti/login/login.component';
import { RegistrazioneComponent } from './componenti/login/registrazione/registrazione.component';
import { DashboardComponent } from './componenti/dashboard/dashboard.component';
import { PaginaListaAmiciComponent } from './componenti/pagina-lista-amici/pagina-lista-amici.component';
import { PaginaCarteComponent } from './componenti/pagina-carte/pagina-carte.component';
// import { PaginaMazziComponent } from './componenti/pagina-mazzi/pagina-mazzi.component';
import { PaginaMarketplaceComponent } from './componenti/pagina-marketplace/pagina-marketplace.component';
import { PaginaAccountComponent } from './componenti/pagina-account/pagina-account.component';
import {RouterOutlet} from "@angular/router";
import { AppRoutingModule } from './app-routing.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import{MatTableModule} from "@angular/material/table";
import {MatListModule} from '@angular/material/list';
import { PaginaHomeComponent } from './componenti/pagina-home/pagina-home.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import { ContinuaConGoogleComponent } from './componenti/login/continua-con-google/continua-con-google.component';
import { ErrorComponent } from './componenti/error/error.component';
import {MatTabsModule} from "@angular/material/tabs";
import { PopupComponent } from "./componenti/popupconfermaacquisto/popup/compra/popup.component";
import{VendipopComponent} from "./popup/vendi/vendipop/vendipop.component"
import {MatCardModule} from "@angular/material/card";
// import {PopupComponent} from "./componenti/popupconfermaacquisto/popup/compra/popup.component";
// import {VendipopComponent} from "./popup/vendi/vendipop/vendipop.component";
import { PaginaScambiCarteComponent } from './componenti/pagina-scambi-carte/pagina-scambi-carte.component';
import { PaginaFaiOffertaComponent } from './componenti/pagina-fai-offerta/pagina-fai-offerta.component';
import { PaginaCreaOffertaComponent } from './componenti/pagina-crea-offerta/pagina-crea-offerta.component';
import { DialogMessageComponent } from './componenti/dialog-message/dialog-message.component';
import { PaginaFaiControffertaComponent } from './componenti/pagina-fai-controfferta/pagina-fai-controfferta.component';

import {MatChipsModule} from "@angular/material/chips";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import {PaginaMazziComponent} from "./componenti/pagina-mazzi/pagina-mazzi.component";
//
import { PaginaMatchmakingComponent } from './componenti/pagina-matchmaking/pagina-matchmaking.component';
import { PaginaVisualizzaMazzoComponent } from './componenti/pagina-visualizza-mazzo/pagina-visualizza-mazzo.component';
import {MatchingpopComponent} from "./popup/matchingpop/matchingpop.component";

import { NgChartsModule } from 'ng2-charts';
import { ChangeNicknamePopComponent } from './popup/changeNickname/change-nickname-pop/change-nickname-pop.component';
import { ChangePasswordPopComponent } from './popup/changePassword/change-password-pop/change-password-pop.component';
import { AdminPageComponent } from './admin-page/admin-page.component'; // npm install ng2-charts per installarlo

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    RegistrazioneComponent,
    DashboardComponent,
    PaginaListaAmiciComponent,
    PaginaCarteComponent,
    PaginaMazziComponent,
    PaginaMarketplaceComponent,
    PaginaAccountComponent,
    PaginaHomeComponent,
    ContinuaConGoogleComponent,
    ErrorComponent,
    PopupComponent,
    PaginaMarketplaceComponent,
    VendipopComponent,
    PaginaScambiCarteComponent,
    PaginaFaiOffertaComponent,
    PaginaCreaOffertaComponent,
    DialogMessageComponent,
    PaginaFaiControffertaComponent,
    VendipopComponent,
    PaginaMatchmakingComponent,
    PaginaVisualizzaMazzoComponent,
    MatchingpopComponent,
    ChangeNicknamePopComponent,
    ChangePasswordPopComponent,
    AdminPageComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterOutlet,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    SocialLoginModule,
    MatTableModule,
    GoogleSigninButtonModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatLegacyChipsModule,
    NgChartsModule

  ],
    providers: [
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                '1021807043471-3rrpe2g2l0ln7g5iah4emgbhjd8sajb0.apps.googleusercontent.com'
              )
            },
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
