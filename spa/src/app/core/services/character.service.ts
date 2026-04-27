import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dragonball-api.com/api/characters';

  // Método asíncrono para obtener personajes
async getCharacters(page: number = 1, limit: number = 10, name: string = '') {
  // Si hay búsqueda, pedimos un límite alto (ej. 50) para poder filtrar por raza localmente
  const url = name 
    ? `${this.apiUrl}?limit=50` 
    : `${this.apiUrl}?page=${page}&limit=${limit}`;
    
  return await firstValueFrom(this.http.get<any>(url));
}



}
