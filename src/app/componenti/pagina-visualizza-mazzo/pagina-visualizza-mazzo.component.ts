import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SharedDataService} from "../../servizi/shared_data_service/shared-data.service";

@Component({
  selector: 'app-pagina-visualizza-mazzo',
  templateUrl: './pagina-visualizza-mazzo.component.html',
  styleUrls: ['./pagina-visualizza-mazzo.component.css']
})
export class PaginaVisualizzaMazzoComponent implements OnInit{

  deck: any


  constructor(private route: ActivatedRoute, private router: Router, private sharedDataService: SharedDataService) {
  }

  ngOnInit(): void {

    if(this.sharedDataService.getDeck() === undefined){
      // torno alla pagina del matchmaking
      this.router.navigate(["/dashboard/matchmaking"]);
    }
    else{
      this.route.queryParams.subscribe(params => {

        // Recupero il parametro dalla query string che contiene il nickname dell'utente del quale voglio vedere le carte:
        this.deck = this.sharedDataService.getDeck();

        console.log("this.deck:")
        console.log(this.deck)
        console.log("this.deck.carteassociate:")
        console.log(this.deck.carteassociate)

        for(const oggetto in this.deck.carteassociate){
          console.log(this.deck.carteassociate[oggetto])
        }
      });
    }

  }


}
