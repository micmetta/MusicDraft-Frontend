
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {PaginaMarketplaceComponent} from "../../../pagina-marketplace/pagina-marketplace.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  constructor(public dialogRef: MatDialogRef<PaginaMarketplaceComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private http: HttpClient) {}

  confermaAcquisto() {
    // Qui puoi inserire la logica per confermare l'acquisto
    this.dialogRef.close('acquisto-confermato');
  }

  annullaAcquisto() {
    this.dialogRef.close();
  }

}
