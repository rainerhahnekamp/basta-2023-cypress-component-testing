import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import de from '@angular/common/locales/de';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ConfigService } from './app/config-service';
import { baseUrlInterceptor, BaseUrlInterceptor } from './app/base-url.interceptor';
import { LoadingInterceptor } from './app/shared/loading.interceptor';
import { registerLocaleData } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

registerLocaleData(de, 'de-AT');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideStore(),
    provideEffects([]),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'de-AT' },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: ConfigService,
      useValue: new ConfigService(environment.baseUrl)
    },
    provideHttpClient(withInterceptors([baseUrlInterceptor]), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    importProvidersFrom(MatDialogModule)
  ]
});
