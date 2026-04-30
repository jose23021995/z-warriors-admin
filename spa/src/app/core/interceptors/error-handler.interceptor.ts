import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'La comunicación con el planeta Namek ha fallado';

      if (error.status !== 0 && window.navigator.onLine) {
        // Accedemos al mensaje de error que viene del servidor o al status text
        errorMessage = error.error?.message || error.statusText || 'Error inesperado';
      }

      messageService.add({
        severity: 'error',
        summary: `Error ${error.status || ''}`,
        detail: errorMessage,
        life: 5000
      });

      return throwError(() => error);
    })
  );
};
