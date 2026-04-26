import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import loginData from '../../interfaces/text/login-texts.json';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
const { "theme-md": { dark, light } } = loginData;
const { "theme-sm": { dark:darkSM, light:lightSM } } = loginData;
@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [CommonModule,SelectButtonModule, FormsModule],
  templateUrl: './dark-mode.component.html',
  styleUrl: './dark-mode.component.scss',
})
export class DarkModeComponent implements OnInit {
  // Convertido a Signal
  isDarkMode = signal(false);
  dark = dark;
  light = light;
  darkSM = darkSM;
  lightSM = lightSM;

  stateOptions: any[] = [
    { label: lightSM, value: 'light' },
    { label: darkSM, value: 'dark' }
  ];

  value1: string = 'light';

  ngOnInit() {
    const isDark = document.documentElement.classList.contains('my-app-dark');
    this.isDarkMode.set(isDark);
    this.value1 = isDark ? 'light' : 'dark';
  }


  toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('my-app-dark');
    console.log(isDark)
    this.value1 = isDark ? 'light' : 'dark';
    this.isDarkMode.set(isDark);
  }
}
