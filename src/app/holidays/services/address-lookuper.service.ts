import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { validateAddress } from './validate-address';

@Injectable({ providedIn: 'root' })
export class AddressLookuper {
  #httpClient = inject(HttpClient);
  #counter = 0;

  get counter() {
    return this.#counter;
  }

  lookup(query: string): Observable<boolean> {
    this.#counter++;
    return this.#httpClient
      .get<unknown[]>('https://nominatim.openstreetmap.org/search.php', {
        params: new HttpParams().set('format', 'jsonv2').set('q', query)
      })
      .pipe(map((addresses) => addresses.length > 0));
  }
}
