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
// ... (imports iguales)

export class TableComponent {
  characters = input<any[]>([]); 
  totalRecords = input<number>(0); 
  loading = input<boolean>(false);
  onLoadData = output<{ page: number, limit: number, search?: string }>();
  
  searchQuery = signal<string>('');
  rows = signal<number>(10);

  displayData = computed(() => this.characters());
  displayTotal = computed(() => this.totalRecords());

  loadCharactersLazy(event: TableLazyLoadEvent) {
    if (typeof event.rows === 'number') {
      this.rows.set(event.rows);
    }

    // Calculamos página
    const page = (event.first ?? 0) / (this.rows()) + 1;
    
    this.onLoadData.emit({ 
      page, 
      limit: this.rows(), 
      search: this.searchQuery() 
    });
  }

triggerSearch() {
  this.onLoadData.emit({ 
    page: 1, 
    limit: this.rows(), 
    search: this.searchQuery() // Enviamos lo que el usuario escribió
  });
}


  getRaceSeverity(race: string): "success" | "info" | "warn" | "danger" | "secondary" | undefined {
    const r = race?.toLowerCase();
    if (r === 'saiyan') return 'warn';
    if (r === 'human') return 'info';
    if (r === 'namekian') return 'success';
    if (r === 'frieza race') return 'danger';
    return 'secondary';
  }
}
