import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import loginData  from '../../interfaces/text/login-texts.json';
const { theme: { dark, light } } = loginData;

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-mode.component.html',
  styleUrl: './dark-mode.component.scss',
})

export class DarkModeComponent 
{
  isDarkMode = false;
  dark = dark;
  light = light;
  
  constructor() {}

  toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('my-app-dark');
    this.isDarkMode = !this.isDarkMode;
  }
}
