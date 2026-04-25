import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button'; // Re-importamos PrimeNG

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule], // Lo añadimos aquí
  templateUrl: './app.html', 
  styleUrl: './app.scss'
})
export class AppComponent {
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }
}
