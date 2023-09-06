import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcquistaService {

  private backendUrl = 'URL_DEL_BACKEND'; // Sostituisci con l'URL effettivo del tuo backend

  constructor(private http: HttpClient) {}

  buyCard(cardInfo: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/buy`, cardInfo);
  }
}
