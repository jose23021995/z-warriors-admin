import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// IMPORTANTE: Agregamos esta línea
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';
// No olvides importar el MessageService si lo vas a usar aquí
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([errorHandlerInterceptor])
    ),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
    MessageService // Lo agregamos como proveedor global para que el Interceptor pueda usarlo
  ]
};
