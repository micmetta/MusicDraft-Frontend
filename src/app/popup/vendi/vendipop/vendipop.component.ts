import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-vendipop',
  templateUrl: './vendipop.component.html',
  styleUrls: ['./vendipop.component.css']
})
export class VendipopComponent {
  cost: number = 0;

  constructor(
    public dialogRef: MatDialogRef<VendipopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmSell(): void {
    this.dialogRef.close({ cost: this.cost });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
