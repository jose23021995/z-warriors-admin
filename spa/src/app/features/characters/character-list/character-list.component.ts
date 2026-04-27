import { Component, OnInit, inject, signal  } from '@angular/core';
import { HeadersComponent } from '../../../shared/components/headers/headers'; // Importa la ruta correcta
import { CardModule } from 'primeng/card';
import {TableComponent} from '../../../shared/components/table/table';
import { CharacterService } from '../../../core/services/character.service'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [HeadersComponent,CardModule,TableComponent,CommonModule,ProgressSpinnerModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent implements OnInit { // Implementa la interfaz
  private charService = inject(CharacterService);
  
  characters = signal<any[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    // Si la tabla no fuera Lazy, aquí llamaríamos a la carga inicial
    console.log('Componente inicializado. La tabla Lazy disparará la carga automáticamente.');
    this.handleLoadData({ page: 2, limit: 10 });
  }

async handleLoadData(event: { page: number; limit: number; search?: string }) {
  try {
    this.isLoading.set(true);
    const response = await this.charService.getCharacters(event.page, event.limit, event.search);
    
    // Normalizamos la respuesta a un Array
    let rawData: any[] = response.items || (Array.isArray(response) ? response : [response]);

    if (event.search) {
      const query = event.search.toLowerCase();
      
      // FILTRO HÍBRIDO: Busca en Nombre O en Raza
      const filtered = rawData.filter(char => 
        char.name.toLowerCase().includes(query) || 
        char.race.toLowerCase().includes(query)
      );

      this.characters.set(filtered);
      this.totalCount.set(filtered.length);
    } else {
      // Carga normal paginada
      this.characters.set(rawData);
      this.totalCount.set(response.meta?.totalItems || rawData.length);
    }
  } catch (error) {
    this.characters.set([]);
    this.totalCount.set(0);
  } finally {
    this.isLoading.set(false);
  }
}

}