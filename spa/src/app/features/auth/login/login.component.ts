import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../../core/services/auth.service';
import { DarkModeComponent } from '../../../shared/components/dark-mode/dark-mode.component';
import loginData  from '../../../shared/interfaces/text/login-texts.json';
const {auth:{title,buttonText,passLabel,subtitle,userLabel}} =loginData;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    DarkModeComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // 2. Usar inject en lugar de constructor
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 3. Variables de texto como Signals (Opcional, pero consistente)
  public title = signal(title);
  public subtitle = signal(subtitle);
  public userLabel = signal(userLabel);
  public passLabel = signal(passLabel);
  public buttonText = signal(buttonText);
  
  // Señal para manejar el estado del botón
  public isLoading = signal(false);

  public loginForm: FormGroup = this.fb.group({
    username: ['admin', [Validators.required]],
    password: ['admin123', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading.set(true); // Actualizar señal
      const { username, password } = this.loginForm.value;

      if (username === 'admin' && password === 'admin123') {
        this.authService.login('fake-jwt-token');
      } else {
        alert('Credenciales incorrectas');
        this.isLoading.set(false);
      }
    }
  }
}