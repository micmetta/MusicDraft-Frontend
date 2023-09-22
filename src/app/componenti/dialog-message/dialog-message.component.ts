import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }, private dialogRef: MatDialogRef<DialogMessageComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }

}
