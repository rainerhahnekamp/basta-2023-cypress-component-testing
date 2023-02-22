import { asyncScheduler, of, scheduled } from 'rxjs';
import { createHoliday } from '../model/holiday';
import { TestBed } from '@angular/core/testing';
import { RequestInfoComponent } from './request-info.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store';
import { holidaysFeature } from '../+state/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from '../+state/holidays.effects';
import { provideConfigMock } from '../../config-service';
import { MatDialogModule } from '@angular/material/dialog';
import { Test } from 'mocha';
import { AddressLookuper } from '../services/address-lookuper.service';

describe('RequestInfo Component', function () {
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

    cy.intercept('https://api.eternal-holidays.net/holiday', { body: [createHoliday({ id: 1 })] });
    cy.intercept('https://nominatim.openstreetmap.org/search.php', { body: [[true]] });
    cy.mount(RequestInfoComponent, {
      imports: [MatDialogModule],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => 1 }) } },
        provideHttpClient(),
        provideNoopAnimations(),
        provideStore(),
        provideState(holidaysFeature),
        provideEffects([HolidaysEffects]),
        provideConfigMock
      ]
    });

    cy.findByRole('textbox', { name: 'Address' }).type('Haupstrasse 5');
    cy.findByRole('button', { name: 'Send' }).click();
    cy.findByRole('status')
      .should('have.text', 'Brochure sent')
      .and(() => {
        const lookuper = TestBed.inject(AddressLookuper);
        expect(lookuper.counter).to.eq(1);
      });
  });
});
