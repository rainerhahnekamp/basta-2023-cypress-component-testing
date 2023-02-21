import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddressLookuper } from '../services/address-lookuper.service';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Holiday } from '../model/holiday';
import { HolidayCardComponent } from '../holiday-card.component';
import { HolidaysRepository } from '../+state/holidays-repository.service';
import { CookieService } from '../../shared/cookie.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    HolidayCardComponent,
    NgIf,
    AsyncPipe
  ]
})
export class RequestInfoComponent implements OnInit {
  #lookuper = inject(AddressLookuper);
  #formBuilder = inject(NonNullableFormBuilder);
  #route = inject(ActivatedRoute);
  #holidaysRepository = inject(HolidaysRepository);
  // #cookieService = inject(CookieService);

  formGroup = this.#formBuilder.group({
    address: ['']
  });
  @Input() address = '';

  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;
  holiday$: Observable<Holiday> = this.#holidaysRepository.selected$;

  ngOnInit(): void {
    this.#route.paramMap.subscribe((paramMap) =>
      this.#holidaysRepository.select(Number(paramMap.get('id')))
    );

    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => this.#lookuper.lookup(this.formGroup.getRawValue().address)),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  search(): void {
    this.submitter$.next();
  }
}
