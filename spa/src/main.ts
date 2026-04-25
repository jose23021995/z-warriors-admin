import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent)
  .catch(err => {
    // Esto imprimirá el error real en la consola (F12) si falla
    console.error('Error crítico de arranque:', err);
  });
