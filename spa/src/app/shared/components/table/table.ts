import { Component, OnInit, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image'; // <--- Falta este
import { ProgressBarModule } from 'primeng/progressbar'; // <--- Falta este

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, SelectModule, 
    IconFieldModule, InputIconModule, MultiSelectModule, SliderModule, 
    TagModule, InputTextModule,ImageModule,ProgressBarModule
  ],
  templateUrl: './table.html',
})
export class TableComponent implements OnInit {
  // Recibimos los datos desde el padre usando Signals (Angular 17.2+)
  data = input<any[]>([]); 
  loading = input<boolean>(false);
 getRaceSeverity(race: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (race.toLowerCase()) {
      case 'saiyan': return 'warn';   
      case 'human': return 'info';    
      case 'namekian': return 'success'; 
      case 'frieza race': return 'danger'; // Cambiado a danger para evitar problemas de tipos si 'help' no existe en tu versión
      default: return 'secondary';
    }
  }

mockData = [
  { id: 1, name: 'Goku', race: 'Saiyan', image: 'https://primefaces.org', ki: 9001, gender: 'male', status: 'qualified' },
  { id: 2, name: 'Bulma', race: 'Human', image: 'https://primefaces.org', ki: 50, gender: 'female', status: 'new' },
  { id: 3, name: 'Piccolo', race: 'Namekian', image: 'https://primefaces.org', ki: 5000, gender: 'male', status: 'negotiation' },
  { id: 4, name: 'Frieza', race: 'Frieza Race', image: 'https://primefaces.org', ki: 8500, gender: 'male', status: 'unqualified' }
];
  // Signals locales para filtros
  representatives = signal<any[]>([]);
  statuses = signal<any[]>([]);

  ngOnInit() {
    this.statuses.set([
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ]);
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified': return 'danger';
      case 'qualified': return 'success';
      case 'new': return 'info';
      case 'negotiation': return 'warn';
      case 'renewal': return null;
      default: return null;
    }
  }

  // Helper para el input de búsqueda global
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
