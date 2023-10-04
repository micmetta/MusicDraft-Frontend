import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MazzoService {
  private baseUrl = '/api/v1/cartemazzi';


  constructor(private http: HttpClient) {}

  creaNuovoMazzo(nomeMazzo: string, carteSelezionate: any[], nickname:string): Observable<any> {

    const body = {
      nomeMazzo,
      carteSelezionate,
      nickname

    };


    // Esegui la richiesta POST con le opzioni CORS configurate
    return this.http.post(`${this.baseUrl}/salvaMazzo`, body);

  }

  // Altri metodi per eliminare, modificare, ecc. se necessario
}
