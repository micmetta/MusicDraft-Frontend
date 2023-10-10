import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  text1: any;
  text2: any;


  constructor(private http: HttpClient) {
  }

  handleButton1() {
    this.http.post("/api/v1/collect/insert-artist",this.text1).subscribe(
      (data:any)=>{
        console.log("Artista Inserito")
      }
    )

  }

  handleButton2() {
    this.http.get("api/v1/marketplace/creaCardArtista").subscribe(
      (data:any)=>{
        console.log("inserito artista in marketplace")
      }
    )

  }

  handleButton3() {
    this.http.post("/api/v1/collect/insert-track",this.text2).subscribe(
      (data:any)=>{
        console.log("Brano inserito")
      }
    )
  }

  handleButton4() {
    this.http.get("api/v1/marketplace/creaCardTrack").subscribe(
      (data:any)=>{
        console.log("inserito brano in marketplace")
      }
    )
  }
}
