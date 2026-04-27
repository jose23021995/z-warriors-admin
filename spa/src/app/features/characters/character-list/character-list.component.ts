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
    const response = await this.charService.getCharacters(event.page, event.limit);
    this.characters.set(response.items || []);
    this.totalCount.set(response.meta?.totalItems || 0);

    // AQUÍ es donde debes hacer el log para ver los resultados:
    console.log('Personajes cargados:', this.characters()); 
  } catch (error) {
    console.error(error);
  } finally {
    this.isLoading.set(false);
  }
}
}