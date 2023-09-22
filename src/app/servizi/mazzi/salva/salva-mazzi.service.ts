import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MazzoService {
  private baseUrl = 'http://localhost:9092/api/v1/cartemazzi';


  constructor(private http: HttpClient) {}

  creaNuovoMazzo(nomeMazzo: string, carteSelezionate: any[], nickname:string): Observable<any> {
    const body = {
      nomeMazzo,
      carteSelezionate,
      nickname

    };
    console.log(body)
    return this.http.post(`${this.baseUrl}/salvaMazzo`, body);
  }

  // Altri metodi per eliminare, modificare, ecc. se necessario
}
