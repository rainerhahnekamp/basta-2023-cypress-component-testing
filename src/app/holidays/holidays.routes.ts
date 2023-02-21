import { Routes } from '@angular/router';
import { HolidaysComponent } from './holidays.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { provideState } from '@ngrx/store';
import { holidaysFeature } from './+state/holidays.reducer';
import { provideEffects } from '@ngrx/effects';
import { HolidaysEffects } from './+state/holidays.effects';

const holidayRoutes: Routes = [
  {
    path: '',
    providers: [provideState(holidaysFeature), provideEffects([HolidaysEffects])],
    children: [
      {
        path: '',
        component: HolidaysComponent,
        title: 'Holidays'
      },
      {
        path: 'request-info/:id',
        component: RequestInfoComponent,
        title: 'Request more info'
      }
    ]
  }
];

export default holidayRoutes;
