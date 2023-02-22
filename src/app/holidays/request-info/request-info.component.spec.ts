import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RequestInfoComponent } from './request-info.component';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
import { holidaysFeature } from '../+state/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from '../+state/holidays.effects';
import { provideConfigMock } from '../../config-service';
import { createHoliday } from '../model/holiday';
import { expect } from '@jest/globals';
import { MatDialogModule } from '@angular/material/dialog';

it('should find an address', fakeAsync(() => {
  const httpClient = {
    get(url: string) {
      if (url === 'https://api.eternal-holidays.net/holiday') {
        return scheduled([[createHoliday({ id: 1 })]], asyncScheduler);
      } else if (url === 'https://nominatim.openstreetmap.org/search.php') {
        return scheduled([[true]], asyncScheduler);
      }
      throw `unbekannte URL ${url}`;
    }
  };
  const fixture = TestBed.configureTestingModule({
    imports: [RequestInfoComponent, MatDialogModule],
    providers: [
      { provide: HttpClient, useValue: httpClient },
      { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 1 }) } },
      provideNoopAnimations(),
      provideStore(),
      provideState(holidaysFeature),
      provideEffects([HolidaysEffects]),
      provideConfigMock
    ]
  }).createComponent(RequestInfoComponent);
  fixture.detectChanges();

  const input = document.querySelector('[data-testid=inp-address]') as HTMLInputElement;
  const button = document.querySelector('[data-testid=btn-search]') as HTMLButtonElement;
  const message = document.querySelector('[data-testid=txt-message]') as HTMLParagraphElement;

  input.value = 'Hauptstrasse 5';
  input.dispatchEvent(new CustomEvent('input')); // Painpoint 1: DOM Handling
  expect(fixture.componentInstance.formGroup.getRawValue().address).toBe('Hauptstrasse 5');
  fixture.detectChanges(); // Painpoint 2: Change Detection
  button.click();

  tick(); // Paintpoint 3: Asynchronität
  fixture.detectChanges();

  expect(message.textContent).toBe('Brochure sent');
  flush();
}));
