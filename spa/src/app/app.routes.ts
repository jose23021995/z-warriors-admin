import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    // CORRECCIÓN AQUÍ: m.DashboardLayoutComponent
    loadComponent: () => import('./features/dashboard/dashboard-layout/dashboard-layout.component')
      .then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'characters',
        loadComponent: () => import('./features/characters/character-list/character-list.component')
          .then(m => m.CharacterListComponent)
      },
      // Puedes agregar aquí la ruta de estadísticas después
      { path: '', redirectTo: 'characters', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
