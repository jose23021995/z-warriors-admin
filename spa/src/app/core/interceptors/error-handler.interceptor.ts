import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      // Si no hay respuesta o la URL está mal (status 0 suele ser error de red)
      if (error.status === 0 || !window.navigator.onLine) {
        errorMessage = 'La comunicación con el planeta Namek ha fallado';
      } else {
        errorMessage = `Error del servidor: ${error.message}`;
      }

      // Mostramos el Toast de PrimeNG
      messageService.add({
        severity: 'error',
        summary: 'Error de Conexión',
        detail: errorMessage,
        life: 5000 // Duración de 5 segundos
      });

      return throwError(() => error);
    })
  );
};
