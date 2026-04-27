import { Component, input, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    ImageModule, 
    ProgressBarModule, 
    TooltipModule, 
    InputTextModule,
    IconFieldModule, 
    InputIconModule, 
    SkeletonModule
  ],
  templateUrl: './table.html',
})
export class TableComponent {
  // Inputs reales desde la API
  characters = input<any[]>([]); 
  totalRecords = input<number>(0); 
  loading = input<boolean>(false);

  // Evento para el componente padre
  onLoadData = output<{ page: number, limit: number, search?: string }>();
  
  // Estado local
  searchQuery = signal<string>('');
  rows = signal<number>(10); // Controla el selector de cantidad de la imagen

  // 1. Datos de prueba (Mocks)
  private mockData = [
    { id: 1, name: 'Goku', race: 'Saiyan', image: 'https://dragonball-api.com', ki: 9001, gender: 'Male' },
    { id: 2, name: 'Vegeta', race: 'Saiyan', image: 'https://dragonball-api.com', ki: 8500, gender: 'Male' },
    { id: 3, name: 'Piccolo', race: 'Namekian', image: 'https://dragonball-api.com', ki: 5000, gender: 'Male' },
    { id: 4, name: 'Bulma', race: 'Human', image: 'https://dragonball-api.com', ki: 50, gender: 'Female' },
    { id: 5, name: 'Freezer', race: 'Frieza Race', image: 'https://dragonball-api.com', ki: 7500, gender: 'Male' },
    { id: 6, name: 'Trunks', race: 'Saiyan', image: 'https://dragonball-api.com', ki: 7500, gender: 'Male' },
  ];

  // 2. Lógica reactiva para filtrar mocks o mostrar datos reales
  displayData = computed(() => {
    const data = this.characters();
    const query = this.searchQuery().toLowerCase();

    // Si hay datos de la API, se muestran esos directamente
    if (data.length > 0) return data;

    // Si no, filtramos los mocks localmente para que el buscador funcione
    if (!query) return this.mockData;

    return this.mockData.filter(char => 
      char.name.toLowerCase().includes(query) || 
      char.race.toLowerCase().includes(query)
    );
  });

  // Total de registros para que el paginador sepa cuántas páginas crear
  displayTotal = computed(() => {
    return this.characters().length > 0 ? this.totalRecords() : this.displayData().length;
  });

  // 3. Métodos de carga y búsqueda
  loadCharactersLazy(event: TableLazyLoadEvent) {
    // Corrección: Solo actualizamos si event.rows es un número
    if (typeof event.rows === 'number') {
      this.rows.set(event.rows);
    }

    const page = (event.first ?? 0) / (this.rows()) + 1;
    const limit = this.rows();
    
    this.onLoadData.emit({ 
      page, 
      limit, 
      search: this.searchQuery() 
    });
  }


  triggerSearch() {
    // Reiniciamos a la página 1 al buscar
    this.onLoadData.emit({ 
        page: 1, 
        limit: this.rows(), 
        search: this.searchQuery() 
    });
  }

  // Estética de las etiquetas de Raza
  getRaceSeverity(race: string): "success" | "info" | "warn" | "danger" | "secondary" | undefined {
    const r = race?.toLowerCase();
    if (r === 'saiyan') return 'warn';
    if (r === 'human') return 'info';
    if (r === 'namekian') return 'success';
    if (r === 'frieza race') return 'danger';
    return 'secondary';
  }
}
