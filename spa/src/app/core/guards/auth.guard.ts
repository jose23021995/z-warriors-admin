import { inject } from '@angular/core';
//Utiliza el método inject() para obtener las dependencias sin necesidad de un constructor de clase.
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.getToken()) {
    return true;
  }
  return router.parseUrl('/login');
};

