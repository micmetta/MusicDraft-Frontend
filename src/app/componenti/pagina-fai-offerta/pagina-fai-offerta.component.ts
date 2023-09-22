import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {ShowCarteInVenditaService} from "../../servizi/marketplace/show-carte-in-vendita.service";
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";

@Component({
  selector: 'app-pagina-fai-offerta',
  templateUrl: './pagina-fai-offerta.component.html',
  styleUrls: ['./pagina-fai-offerta.component.css']
})
export class PaginaFaiOffertaComponent implements OnInit{

  // @ts-ignore
  user_offerta: string
  lista_carte_artisti_utente : any
  lista_carte_brani_utente :any



  constructor(private route: ActivatedRoute, private show:ShowCarteInVenditaService,
              private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private sharedDataService: SharedDataService,
              private router: Router) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      // Recupero il parametro dalla query string che contiene il nickname dell'utente del quale voglio vedere le carte:
      this.user_offerta = params['parametro'];


      // Ora invoco il backend per farmi passare tutte le carte dell'utente con nickname->"user_offerta":
      this.show.getCarteArtistaByNickname(this.user_offerta)
        .subscribe(((data:any)=>{
          this.lista_carte_artisti_utente= Object.keys(data).map((key)=>{return data[key]});
          console.log(data);
        }))
      this.show.getCarteBranoByNickname(this.user_offerta)
        .subscribe(((data:any)=>{
          this.lista_carte_brani_utente = Object.keys(data).map((key)=>{return data[key]});
          console.log(data);
        }))
    });
  }

  proponiOfferta(carta: any, tipo_carta: any, user_offerta: any){

    console.log("Vado alla pagina - creaPoposta per: ", carta.nome)

    // modifico la variabile condivisa che rappresenta la "carta richiesta"
    // per la quale verrà fatta l'offerta:
    this.sharedDataService.setCartaData(carta);
    this.sharedDataService.setTipoCartaData(tipo_carta); //"artista" o "brano"
    this.sharedDataService.setNicknamePropCarta(user_offerta); // passo anche il nickname dell'utente al quale voglio fare l'offerta

    // vado alla pagina "crea_offerta" passandogli la carta richiesta (per la quale verrà fatta l'offerta):
    this.router.navigate(["/dashboard/crea_offerta"]);

  }

}
