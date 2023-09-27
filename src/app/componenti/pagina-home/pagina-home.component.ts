import {Component, OnInit} from '@angular/core';
import {
  Nickname_and_email_user_loggedService
} from "../../servizi/nickname_and_email_user_loggedService/nickname_and_email_user_logged.service";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {MatchmakingServiceService} from "../../servizi/matchmaking_service/matchmaking-service.service";

import { ChartOptions, ChartDataset, ChartType } from 'chart.js';


@Component({
  selector: 'app-pagina-home',
  templateUrl: './pagina-home.component.html',
  styleUrls: ['./pagina-home.component.css']
})
export class PaginaHomeComponent implements OnInit{

  // @ts-ignore
  nickname_user_logged: String; // contiene il nickname dell'utente
  // @ts-ignore
  email_user_logged: String; // contiene l'email dell'utente
  points_user: number = 0; // conterrà i points dell'utente

  partite_concluse_utente_loggato: any[] = []
  listaDiDIzionari_carte_mazzo_U1_partite_concluse: {
    lista_info_carte_associate_mazzo_U1: any;
  }[] = [];
  listaDiDIzionari_carte_mazzo_U2_partite_concluse: {
    lista_info_carte_associate_mazzo_U2: any;
  }[] = [];
  // lista_date_partite_giocate: any[] = [];
  // lista_points_guadagnati_in_data_giocata: any[] = [];
  lista_points_guadagnati_in_data_giocata: any[] = [];

  // Definisco le variabili per il grafico
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Imposta questa opzione su false
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    { data: [], label: 'Profitto Totale' }
  ];

  // @ts-ignore
  private subscription: Subscription;

  constructor(private nicknameAndEmailUserLoggedService: Nickname_and_email_user_loggedService,
              private authService: AuthService,
              private matchmakingService: MatchmakingServiceService,
              private router: Router) {
  }

  ngOnInit(): void {
    // this.subscription = this.nicknameAndEmailUserLoggedService.nickname_user_logged$.subscribe(value => {
    //   this.nickname_user_logged = value;
    // });
    //
    // this.subscription = this.nicknameAndEmailUserLoggedService.email_user_logged$.subscribe(value => {
    //   this.email_user_logged = value;
    // });

    this.nickname_user_logged = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged();
    this.nicknameAndEmailUserLoggedService.nickname_user_logged$.subscribe(value => {
      this.nickname_user_logged = value;
    })

    this.email_user_logged = this.nicknameAndEmailUserLoggedService.getStoredEmail_user_logged();
    this.nicknameAndEmailUserLoggedService.email_user_logged$.subscribe(value => {
      this.email_user_logged = value;
    })

    // Prendo i points dell'utente:
    this.authService.getPoints(this.nickname_user_logged).subscribe(data => {
      this.points_user = Number(data);
    })

    // riempio tutta la lista di partite che si sono concluse e che sono state giocate dell'utente loggato:
    this.matchmakingService.getAllPartiteConcluse(this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged()).subscribe(data => {
      console.log("risposta ottenuta dal backend per getAllPartiteConcluse:");
      console.log(data);
      for (const partita_conclusa of data) {
        this.partite_concluse_utente_loggato.push(partita_conclusa);
      }

      console.log("this.partite_concluse_utente_loggato PRIMA DEL SORT:")
      console.log(this.partite_concluse_utente_loggato)
      this.partite_concluse_utente_loggato.sort((a, b) => {
        const dataA = new Date(a.dataGiocata);
        const dataB = new Date(b.dataGiocata);
        return dataA.getTime() - dataB.getTime();
      });
      console.log("this.partite_concluse_utente_loggato DOPO IL SORT:")
      console.log(this.partite_concluse_utente_loggato)

      // Adesso che sono certo che le partite giocate sono ordinate per data, posso calcolare i guadagni di ogni giorno
      // andando a vedere quante partite sono state vinte/perse/pareggiate per ogni giorno:

      const nickname_utente_loggato = this.nicknameAndEmailUserLoggedService.getStoredNickname_user_logged();

      // lista_points_guadagnati_in_data_giocata = [];
      let profittoTotaleGiornata = 0;
      let dataGiornata = null;

      for (const partita of this.partite_concluse_utente_loggato) {
        const { nickVincitore, dataGiocata } = partita;

        if (dataGiocata !== dataGiornata) {
          // Se stiamo cambiando data, aggiungiamo il profitto totale al giorno precedente
          if (dataGiornata !== null) {
            this.lista_points_guadagnati_in_data_giocata.push({
              data_giocata: dataGiornata,
              profitto_totale: profittoTotaleGiornata
            });
          }

          // Iniziamo a calcolare il profitto per la nuova data
          dataGiornata = dataGiocata;
          profittoTotaleGiornata = 0;
        }

        if (nickVincitore === nickname_utente_loggato) {
          profittoTotaleGiornata += 100;
        } else {
          profittoTotaleGiornata -= 100;
        }
      }

      // Aggiungiamo l'ultimo giorno alla lista dei profitti
      if (dataGiornata !== null) {
        this.lista_points_guadagnati_in_data_giocata.push({
          data_giocata: dataGiornata,
          profitto_totale: profittoTotaleGiornata
        });
      }

      console.log("this.lista_points_guadagnati_in_data_giocata:");
      console.log(this.lista_points_guadagnati_in_data_giocata);

      // Estraggo le date e i profitti totali dai dati e li inserisco nei rispettivi array:
      this.barChartLabels = this.lista_points_guadagnati_in_data_giocata.map(item => item.data_giocata);
      this.barChartData[0].data = this.lista_points_guadagnati_in_data_giocata.map(item => item.profitto_totale);
      this.calculateBarColors();
    })

  }

  // Funzione per calcolare i colori delle barre in base al profitto
  calculateBarColors() {
    this.barChartData[0].backgroundColor = this.lista_points_guadagnati_in_data_giocata.map((item) => {
      if (item.profitto_totale > 0) {
        return 'green'; // Profitto positivo (verde)
      } else if (item.profitto_totale < 0) {
        return 'red'; // Profitto negativo (rosso)
      } else {
        return 'gray'; // Profitto uguale a zero (grigio)
      }
    });
  }


  // ADESSO DEVI INSERIRE NEL FRONTEND LA POSSIBILITA' DI CLICCARE SU LISTA AMICI e:
  // - vedere tutti gli amici,
  // - tutte le loro carte,
  // - possibilità di fare un'offerta per una certa carta,
  // - visualizzare tutte le offerte in corso e il loro storico.
  pagina_scambi(){
    this.router.navigate(["/dashboard/scambi_carte"])
  }

}
