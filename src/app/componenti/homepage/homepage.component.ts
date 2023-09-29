import {Component, NgModule, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {PaginaMarketplaceComponent} from "../pagina-marketplace/pagina-marketplace.component";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {forkJoin} from "rxjs";


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  itemsA: any[]=[];
  itemsT: any[]=[];
  itemsIntero: any[]=[];



  constructor(private http:HttpClient, private show: ShowCarteInVenditaService, private nick: Nickname_and_email_user_loggedService) {
  }
  localhostbase= "http://localhost:9095"
  isPopupOpen = false;
  isMarketplacePopupOpen= false;
  isClassificaPopupOpen=false;
  marketplaceData: any;

  userRankList: any[]=[];

  openPopup() {
    this.isPopupOpen = true;
    console.log(this.isPopupOpen)
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  handleItemClick(acquisti: string) {

  }

  openMarketplacePopup() {
    this.isMarketplacePopupOpen=true
    this.fetchCarteInVendita()

  }
  fetchCarteInVendita(){

    forkJoin([
      this.show.getCarteInVenditaArtista(),
      this.show.getCarteInVenditaBrano()
    ]).subscribe(([dataA, dataT]: [any, any]) => {
      // Qui puoi elaborare i dati come desideri
      this.itemsA = Object.keys(dataA).map((key) => dataA[key]);
      this.itemsT = Object.keys(dataT).map((key) => dataT[key]);

      // Unisci gli array quando entrambi i dati sono disponibili
      this.itemsIntero = [...this.itemsA, ...this.itemsT];
      console.log(this.itemsIntero);
    });

  }

  closeMarketplacePopup() {
    this.isMarketplacePopupOpen=false
  }

  openClassifica() {
    this.userRankList=[];
    interface UserRank {
      nick: string;
      rank: number;
    }

    this.isClassificaPopupOpen=true;
    this.http.get<UserRank[]>(this.localhostbase+`/api/v1/cartemazzi/getAllforAlluser`).subscribe(
      (data:UserRank[])=>{

        this.userRankList.push(...data);
        this.userRankList.sort((a, b) => b.rank - a.rank);
      }
    )
  }
  closeClassifica(){
    this.isClassificaPopupOpen=false;
  }
}
