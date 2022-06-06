import { Component, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddressLookuper } from '../services/address-lookuper.service';
import { noNull } from '../../no-null';

@Component({
  selector: 'eternal-request-info',
  templateUrl: './request-info.component.html',
})
export class RequestInfoComponent implements OnInit {
  formGroup = this.formBuilder.group({
    address: [''],
  });
  title = 'Request More Information';
  @Input() address = '';
  submitter$ = new Subject<void>();
  lookupResult$: Observable<string> | undefined;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private lookuper: AddressLookuper
  ) {}

  ngOnInit(): void {
    if (this.address) {
      this.formGroup.setValue({ address: this.address });
    }

    this.lookupResult$ = this.submitter$.pipe(
      switchMap(() => {
        noNull(this.formGroup.value);
        return this.lookuper.lookup(this.formGroup.value.address);
      }),
      map((found) => (found ? 'Brochure sent' : 'Address not found'))
    );
  }

  search(): void {
    this.submitter$.next();
  }
}