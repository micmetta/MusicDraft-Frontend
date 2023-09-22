import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import { HomepageComponent} from "./componenti/homepage/homepage.component";
import { LoginComponent} from "./componenti/login/login.component";
import { RegistrazioneComponent} from "./componenti/login/registrazione/registrazione.component";
import {DashboardComponent} from "./componenti/dashboard/dashboard.component";
import {PaginaHomeComponent} from "./componenti/pagina-home/pagina-home.component";
import {PaginaListaAmiciComponent} from "./componenti/pagina-lista-amici/pagina-lista-amici.component";
import {PaginaCarteComponent} from "./componenti/pagina-carte/pagina-carte.component";
import {PaginaMazziComponent} from "./componenti/pagina-mazzi/pagina-mazzi.component";
import {PaginaMarketplaceComponent} from "./componenti/pagina-marketplace/pagina-marketplace.component";
import {PaginaAccountComponent} from "./componenti/pagina-account/pagina-account.component";
import {AuthService} from "./auth/auth.service";
import {authGuard} from "./auth/auth.guard";
import {ContinuaConGoogleComponent} from "./componenti/login/continua-con-google/continua-con-google.component";
import {ErrorComponent} from "./componenti/error/error.component";
import {PaginaScambiCarteComponent} from "./componenti/pagina-scambi-carte/pagina-scambi-carte.component";
import {PaginaFaiOffertaComponent} from "./componenti/pagina-fai-offerta/pagina-fai-offerta.component";
import {PaginaCreaOffertaComponent} from "./componenti/pagina-crea-offerta/pagina-crea-offerta.component";
import {PaginaFaiControffertaComponent} from "./componenti/pagina-fai-controfferta/pagina-fai-controfferta.component";

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registrazione', component: RegistrazioneComponent},
  {path: 'auth_google', component: ContinuaConGoogleComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], children:[
      {path: '', redirectTo: 'home', pathMatch: 'full'}, // in questo modo ogni volta che vado su http://localhost:4200/dashboard verrò reindirizzato direttamente su http://localhost:4200/dashboard/home
      {path: 'home', component: PaginaHomeComponent},
      {path: 'lista amici', component: PaginaListaAmiciComponent},
      {path: 'carte', component: PaginaCarteComponent},
      {path: 'mazzi', component: PaginaMazziComponent},
      {path: 'marketplace', component: PaginaMarketplaceComponent},
      {path: 'account', component: PaginaAccountComponent},
      {path: 'scambi_carte', component: PaginaScambiCarteComponent},
      {path: 'fai_offerta', component: PaginaFaiOffertaComponent},
      {path: 'crea_offerta', component: PaginaCreaOffertaComponent},
      {path: 'fai_controfferta', component: PaginaFaiControffertaComponent},
    ]},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
