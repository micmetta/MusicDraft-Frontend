import {Component, OnInit} from '@angular/core';
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {HttpClient} from "@angular/common/http";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";

@Component({
  selector: 'app-pagina-carte',
  templateUrl: './pagina-carte.component.html',
  styleUrls: ['./pagina-carte.component.css']
})
export class PaginaCarteComponent implements OnInit{
  nick: any;
  private http: HttpClient;
  itemsA: any
  itemsT :any
  constructor(nick: Nickname_and_email_user_loggedService, http:HttpClient, private show:ShowCarteInVenditaService) {
    this.nick=nick;
    this.http = http;
  }

  ngOnInit(): void {
    this.fetchCarteUtente()

  }
  fetchCarteUtente(){
    this.show.getCarteArtistaByNickname(this.nick.getStoredNickname_user_logged()).subscribe(((data:any)=>{this.itemsA= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
    this.show.getCarteBranoByNickname(this.nick.getStoredNickname_user_logged()).subscribe(((data:any)=>{this.itemsT= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
  }
}
