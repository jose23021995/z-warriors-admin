import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent, // Este es el padre que tiene el <router-outlet>
    canActivate: [authGuard],
    children: [
      {
        path: 'characters', // Se accede como /dashboard/characters
        loadComponent: () => import('./features/characters/character-list/character-list.component')
          .then(m => m.CharacterListComponent)
      },
      {
        path: 'stats', // Se accede como /dashboard/stats
        loadComponent: () => import('./features/stats/stats') // Ajusta la ruta a tu componente de stats
          .then(m => m.Stats)
      },
      {
        path: '', 
        redirectTo: 'characters', 
        pathMatch: 'full' 
      }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
