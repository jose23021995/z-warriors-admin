import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => {
    // Esto imprimirá el error real en la consola (F12) si falla
    console.error('Error crítico de arranque:', err);
  });
