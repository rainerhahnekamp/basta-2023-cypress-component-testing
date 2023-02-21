import { asyncScheduler, of, scheduled } from 'rxjs';
import { createHoliday } from '../model/holiday';
import { TestBed } from '@angular/core/testing';
import { RequestInfoComponent } from './request-info.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store';
import { holidaysFeature } from '../+state/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from '../+state/holidays.effects';
import { provideConfigMock } from '../../config-service';
import { MatDialogModule } from '@angular/material/dialog';

describe('Request Info', () => {
  it('should find an address', () => {
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

    cy.mount(RequestInfoComponent, {
      imports: [MatDialogModule],
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 1 }) } },
        provideNoopAnimations(),
        provideStore(),
        provideState(holidaysFeature),
        provideEffects([HolidaysEffects]),
        provideConfigMock
      ]
    });

    cy.get('[data-testid=inp-address]').type('Hauptstrasse 5');
    cy.get('[data-testid=btn-search]').click();
    cy.get('[data-testid=txt-message]').should('have.text', 'Brochure sent');
  });
});
