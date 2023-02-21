import { Component, inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Injectable({ providedIn: 'root' })
export class CookieService {
  #matDialog = inject(MatDialog);
  constructor() {
    if (this.#isCookieConsentMissing()) {
      this.#matDialog.open(DialogOverviewExampleDialog);
    }
  }

  #isCookieConsentMissing() {
    return !window.localStorage.getItem('cookieConsent');
  }
}

@Component({
  selector: 'cookie-consent',
  template: ` <div mat-dialog-content>
      <p>Can I store cookies?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button (click)="dialogRef.close()">Yes</button>
      <button mat-raised-button (click)="dialogRef.close()">I guess, I have no choice</button>
    </div>`,
  standalone: true,
  imports: [MatInputModule, MatDialogModule, MatButtonModule]
})
export class DialogOverviewExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
