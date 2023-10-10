import {Component, OnInit} from '@angular/core';
import{ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import { MatDialog } from '@angular/material/dialog';
import {PopupComponent} from "../popupconfermaacquisto/popup/compra/popup.component";
import {AcquistaService} from "../../servizi/acquistare/acquista.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";

@Component({
  selector: 'app-pagina-marketplace',
  templateUrl: './pagina-marketplace.component.html',
  styleUrls: ['./pagina-marketplace.component.css']
})

export class PaginaMarketplaceComponent implements OnInit{
  nome:string=""
  popolarita: number=0
  immagine:string=""
  private genere:string = ""
  durata:string=""
  anno_pubblicazione:string=""
  itemsA: any
  itemsT:any
  costo:any;
  private baseUrl = '/api/v1/cartemazzi'
  private baseurl2 ='/api/v1/marketplace'
  // @ts-ignore
  private url: string;
  searchQuery: string = '';
  selectedGenre: string = '';
  FiltereditemsT: any;
  FiltereditemsA: any;
  selectedPopularity: any;
  searchQueryT: any;
  selectedAnnoPubblicazione: any;
  selectedCosto: any;
  id:any;
  private nickname:any;
  private risposta:any;
  constructor(private show: ShowCarteInVenditaService,private dialog: MatDialog, private buy:AcquistaService,private http:HttpClient,private nick:Nickname_and_email_user_loggedService) {

  }

  ngOnInit(): void {
    this.fetchCarteInVendita();
    console.log(this.nick.getStoredNickname_user_logged())
  }

  fetchCarteInVendita(){

    this.show.getCarteInVenditaArtista().subscribe(((data:any)=>{this.itemsA= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
    this.show.getCarteInVenditaBrano().subscribe(((data:any)=>{this.itemsT= Object.keys(data).map((key)=>{return data[key]}); console.log(data)}))
  }
  applyFilters() {
    // Filtra le carte per nome e genere
    console.log(this.itemsA)
    this.FiltereditemsA = this.itemsA.filter((cartaA:any) =>
      cartaA.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedGenre === '' || cartaA.genere === this.selectedGenre) &&
      this.checkPopularity(cartaA.popolarita)&&
      this.checkCosto(cartaA.costo)

    );


  }

  onButtonClick(carta: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: carta,
    });
    console.log(carta.nick)
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'acquisto-confermato') {
        console.log("confermato");

        let url: string;
        let url2: string;
        if (carta.hasOwnProperty('durata')) {
          url = `${this.baseUrl}/acquistaCartaBrano/${this.nick.getStoredNickname_user_logged()}`;
          url2 = `${this.baseurl2}/delete-CardBrano/${carta.id}`
          this.id=carta.id;
          this.nome = carta.nome;
          this.durata = carta.durata;
          this.anno_pubblicazione = carta.anno_pubblicazione;
          this.popolarita = carta.popolarita;
          this.costo = carta.costo;
          this.immagine = carta.immagine;
          this.nickname=carta.nick;
        } else {
          url = `${this.baseUrl}/acquistaCartaArtista/${this.nick.getStoredNickname_user_logged()}`;
          url2 = `${this.baseurl2}/delete-CardArtist/${carta.id}`
          this.id=carta.id;
          this.nome = carta.nome;
          this.popolarita = carta.popolarita;
          this.genere = carta.genere;
          this.costo = carta.costo;
          this.immagine = carta.immagine;
          this.nickname=carta.nick;
        }
        if (carta.hasOwnProperty('durata')) {
          this.http.post(url, {
            "id":this.id,
            "nome": this.nome,
            "durata": this.durata,
            "anno_pubblicazione": this.anno_pubblicazione,
            "popolarita": this.popolarita,
            "immagine": this.immagine,
            "costo": this.costo,
            "nick":this.nickname
          })
            .subscribe(
              (response:any) => {
                // Gestisci la risposta dal backend
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
                this.removeItemFromArray(carta);

              },
              (error:any) => {
                this.risposta=error
                // Gestisci gli errori
                alert("Points non sufficienti")




              }

            );
          console.log(this.risposta)

        } else {
          this.http.post(url, {
            "id": this.id,
            "nome": this.nome,
            "popolarita": this.popolarita,
            "genere": this.genere,
            "immagine": this.immagine,
            "costo": this.costo,
            "nick": this.nickname
          })
            .subscribe(
              (response:any) => {
                // Gestisci la risposta dal backend

                  this.http.delete(url2)
                    .subscribe(
                      (response:any) => {
                        // Gestisci la risposta dal backend
                        this.risposta=response
                        console.log("Risposta dal backend:", response);
                      },
                      error => {
                        this.risposta=error
                        // Gestisci gli errori
                        console.error("Errore nella chiamata:", error);
                      }
                    );
                  this.removeItemFromArray(carta);


              },
              (error:any) => {
                this.risposta=error
                // Gestisci gli errori
                alert("Points non sufficienti");

              }
            );
          console.log(this.risposta)


        }


      }
    });

  }
  private removeItemFromArray(carta: any) {
    console.log("Removing item with ID:", carta.id);
    if (carta.hasOwnProperty('durata')) {
      this.FiltereditemsT = this.FiltereditemsT.filter((item:any) => item.id !== carta.id);
      console.log("itemsT after removal:", this.FiltereditemsT);
    } else {
      console.log("Removing item from itemsA");
      this.FiltereditemsA = this.FiltereditemsA.filter((item:any) => item.id !== carta.id);
      console.log("itemsA after removal:", this.FiltereditemsA);
    }
  }
  private checkPopularity(popolarita: number): boolean {
    if (this.selectedPopularity === '> 20') {
      return popolarita > 20;
    } else if (this.selectedPopularity === '> 50') {
      return popolarita > 50;
    } else if (this.selectedPopularity === '> 70') {
      return popolarita > 70;
    } else {
      return this.selectedPopularity === '' || popolarita === parseInt(this.selectedPopularity);
    }
  }
  private checkCosto(costo:number):boolean{
    if (this.selectedCosto === '> 0') {
      return costo >0;
    } else if (this.selectedCosto === '> 100') {
      return costo > 100;
    } else if (this.selectedCosto === '> 200') {
      return costo > 200;
    } else if (this.selectedCosto === '> 500') {
      return costo > 500;
    } else {
      return this.selectedCosto === '' || costo === parseInt(this.selectedCosto);
    }

  }

  checkAnno(anno:number):boolean {
    console.log(anno)
    if (this.selectedAnnoPubblicazione === '> 1940') {
      return anno > 1940;
    } else if (this.selectedAnnoPubblicazione === '> 1980') {
      return anno > 1980;
    } else if (this.selectedAnnoPubblicazione === '> 2000') {
      return anno > 2000;
    }else if (this.selectedAnnoPubblicazione === '> 2010') {
      return anno > 2010;
    } else {
      return this.selectedAnnoPubblicazione === '' || anno === parseInt(this.selectedAnnoPubblicazione);
    }
  }
  applyFiltersT() {

    this.FiltereditemsT = this.itemsT.filter((cartaT:any) =>
      cartaT.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.checkAnno((cartaT.anno_pubblicazione).substring(0,4))) &&
      this.checkPopularity(cartaT.popolarita)&&
      this.checkCosto(cartaT.costo)


    );
  }
}
