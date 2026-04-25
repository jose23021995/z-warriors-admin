import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal privada para el estado del token
  private _token = signal<string | null>(localStorage.getItem('token'));

  // Signal computada (pública) para saber si está logueado
  isAuthenticated = computed(() => !!this._token());

  constructor(private router: Router) {}

  login(token: string) {
    localStorage.setItem('token', token);
    this._token.set(token);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this._token();
  }
}
