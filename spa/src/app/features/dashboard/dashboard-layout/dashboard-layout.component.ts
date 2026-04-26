import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DarkModeComponent } from '../../../shared/components/dark-mode/dark-mode.component';
import { DividerModule } from 'primeng/divider'; // <--- 1. Importa el módulo

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [DividerModule, RouterOutlet, RouterModule, MenubarModule, ButtonModule, DarkModeComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
  private router = inject(Router);

  // Definición del menú para PrimeNG
  items: MenuItem[] = [
    { 
      label: 'Personajes', 
      icon: 'pi pi-users', 
      routerLink: 'characters' 
    },
    { 
      label: 'Estadísticas', 
      icon: 'pi pi-chart-bar', 
      routerLink: 'stats' 
    }
  ];

  logout() {
    localStorage.removeItem('token'); // Requisito: Borra token
    this.router.navigate(['/login']); // Requisito: Redirige
  }
}
