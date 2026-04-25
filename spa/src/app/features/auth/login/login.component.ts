import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules - ¡Asegúrate de que estos imports estén aquí!
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Vital para [formGroup]
    CardModule,          // Vital para p-card
    ButtonModule,        // Vital para p-button
    InputTextModule,
    PasswordModule,      // Vital para p-password
    FloatLabelModule     // Vital para p-floatLabel
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // 1. Declaramos la propiedad que el HTML busca
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 2. Inicializamos el formulario
    this.loginForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['admin123', [Validators.required]]
    });
  }

  // 3. Creamos la función que el HTML llama en (ngSubmit)
  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      if (username === 'admin' && password === 'admin123') {
        this.authService.login('fake-jwt-token');
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
}
