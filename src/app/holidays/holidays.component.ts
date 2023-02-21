import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { HolidayCardComponent } from './holiday-card.component';
import { BlinkerDirective } from '../shared/blinker.directive';
import { HolidaysRepository } from './+state/holidays-repository.service';

@Component({
  template: `<h2>Choose among our Holidays</h2>
    <div class="flex justify-evenly flex-wrap" *ngIf="holidays$ | async as holidays">
      <app-holiday-card
        *ngFor="let holiday of holidays"
        [holiday]="holiday"
        data-testid="holiday-card"
        appBlinker
      ></app-holiday-card>
    </div>`,
  selector: 'eternal-holidays',
  standalone: true,
  imports: [NgIf, AsyncPipe, NgForOf, HolidayCardComponent, BlinkerDirective]
})
export class HolidaysComponent {
  protected holidays$ = inject(HolidaysRepository).holidays$;
}
