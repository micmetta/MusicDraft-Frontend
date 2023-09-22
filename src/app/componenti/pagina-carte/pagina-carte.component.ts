import {Component, OnInit} from '@angular/core';
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {HttpClient} from "@angular/common/http";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {VendipopComponent} from "../../popup/vendi/vendipop/vendipop.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pagina-carte',
  templateUrl: './pagina-carte.component.html',
  styleUrls: ['./pagina-carte.component.css']
})
export class PaginaCarteComponent implements OnInit{
  private http: HttpClient;
  itemsA: any
  itemsT :any
  private carta: any;
  private baseUrl = 'http://localhost:9092/api/v1/cartemazzi';
  private baseurl2 = 'http://localhost:9091/api/v1/marketplace';
  private nome: any;
  private durata: any;
  private anno_pubblicazione: any;
  private popolarita: any;
  private immagine: any;
  private genere: any;
  private costo: any;
  private id: any;
  private nickname:any;

  private risposta: any;

  constructor(private nick: Nickname_and_email_user_loggedService, http:HttpClient, private show:ShowCarteInVenditaService, private dialog:MatDialog) {

    this.http = http;
  }

  ngOnInit(): void {
    this.fetchCarteUtente()

  }
  fetchCarteUtente(){
    this.show.getCarteArtistaByNickname(this.nick.getStoredNickname_user_logged()).subscribe(((data:any)=>{this.itemsA= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
    this.show.getCarteBranoByNickname(this.nick.getStoredNickname_user_logged()).subscribe(((data:any)=>{this.itemsT= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
  }



  openVendiPopup(carta: any) {


    console.log(carta.nome)
    console.log(carta.popolarita)
    console.log(carta.id)


    this.http.get(`http://localhost:9092/api/v1/cartemazzi/esisteCardinMazzo/${carta.nickname}/${carta.id}`)
      .subscribe(
        (data:any)=>{
          if(data == true){
            alert("questa carta è in uno dei tuoi mazzi quindi non è possibile venderla")
          }else{
            const dialogRef = this.dialog.open(VendipopComponent, {
              width: '300px',
              data: carta
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                let url: string;
                let url2: string;
                console.log(result.cost)
                carta.nick

                if (carta.hasOwnProperty('durata')) {
                  url = `${this.baseurl2}/vendiCartaBrano/${this.nick.getStoredNickname_user_logged()}`;
                  url2 = `${this.baseUrl}/delete-CardBrano/${carta.id}`
                  this.id = carta.id
                  this.nome = carta.nome;
                  this.durata = carta.durata;
                  this.anno_pubblicazione = carta.anno_pubblicazione;
                  this.popolarita = carta.popolarita;
                  this.immagine = carta.immagine;
                  this.costo=result.cost;
                  this.nickname = carta.nick
                } else {
                  url = `${this.baseurl2}/vendiCartaArtista/${this.nick.getStoredNickname_user_logged()}`;
                  url2 = `${this.baseUrl}/delete-CardArtist/${carta.id}`
                  this.id = carta.id
                  this.nome = carta.nome;
                  this.popolarita = carta.popolarita;
                  this.genere = carta.genere;
                  this.immagine = carta.immagine;
                  this.costo=result.cost
                  this.nickname = carta.nick

                }
                console.log(this.nickname)
                if (carta.hasOwnProperty('durata')) {
                  this.http.post(url, {
                    "id": this.id,
                    "nome": this.nome,
                    "durata": this.durata,
                    "anno_pubblicazione": this.anno_pubblicazione,
                    "popolarita": this.popolarita,
                    "immagine": this.immagine,
                    "costo": this.costo,
                    "nick":this.nickname

                  })
                    .subscribe(
                      response => {
                        // Gestisci la risposta dal backend
                        console.log("Risposta dal backend:", response);
                        this.risposta = response;
                      },
                      error => {
                        // Gestisci gli errori
                        console.error("Errore nella chiamata:", error);
                      }
                    );
                  if (this.risposta == null) {

                    this.http.delete(url2)
                      .subscribe(
                        response => {
                          // Gestisci la risposta dal backend
                          console.log("Risposta dal backend:", response);
                        },
                        error => {
                          // Gestisci gli errori
                          console.error("Errore nella chiamata:", error);
                        }
                      );
                  }
                } else {
                  this.http.post(url, {
                    "id": this.id,
                    "nome": this.nome,
                    "popolarita": this.popolarita,
                    "genere": this.genere,
                    "immagine": this.immagine,
                    "costo":this.costo,
                    "nick":this.nickname

                  })
                    .subscribe(
                      response => {
                        // Gestisci la risposta dal backend
                        console.log("Risposta dal backend:", response);
                        this.risposta = response;
                      },
                      error => {
                        // Gestisci gli errori
                        console.error("Errore nella chiamata:", error);
                      }
                    );
                  console.log(url2)
                  if(this.risposta == null) {
                    this.http.delete(url2)
                      .subscribe(
                        response => {
                          // Gestisci la risposta dal backend
                          console.log("Risposta dal backend:", response);
                        },
                        error => {
                          // Gestisci gli errori
                          console.error("Errore nella chiamata:", error);
                        }
                      );
                  }
                }
                this.removeItemFromArray(carta);

              }

            });
          }
        }
      )



      }

  private removeItemFromArray(carta: any) {
    if (carta.hasOwnProperty('durata')) {
      this.itemsT = this.itemsT.filter((item:any) => item.id !== carta.id);
    } else {
      this.itemsA = this.itemsA.filter((item:any) => item.id !== carta.id);
    }
  }
}
