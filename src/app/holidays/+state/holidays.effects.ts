import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { holidaysActions } from './holidays.actions';
import { Holiday } from '../model/holiday';
import { ConfigService } from '../../config-service';
import { Action } from '@ngrx/store';

@Injectable()
export class HolidaysEffects implements OnInitEffects {
  actions$ = inject(Actions);
  httpClient = inject(HttpClient);
  configService = inject(ConfigService);

  ngrxOnInitEffects = () => holidaysActions.load();

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(holidaysActions.load),
      switchMap(() => this.httpClient.get<Holiday[]>('/holiday')),
      map((holidays) =>
        holidays.map((holiday) => ({
          ...holiday,
          imageUrl: `${this.configService.baseUrl}${holiday.imageUrl}`
        }))
      ),
      map((holidays) => holidaysActions.loadSuccess({ holidays }))
    )
  );
}
