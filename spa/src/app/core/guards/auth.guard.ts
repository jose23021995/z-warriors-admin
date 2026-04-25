import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos si el usuario está autenticado usando el Signal del servicio
  if (authService.getToken()) {
    return true;
  }

  // Si no hay token, lo "pateamos" al login como pide el examen
  return router.parseUrl('/login');
};
