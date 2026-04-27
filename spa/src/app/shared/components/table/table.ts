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

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, SelectModule, 
    IconFieldModule, InputIconModule, MultiSelectModule, SliderModule, 
    TagModule, InputTextModule
  ],
  templateUrl: './table.html',
})
export class TableComponent implements OnInit {
  // Recibimos los datos desde el padre usando Signals (Angular 17.2+)
  data = input<any[]>([]); 
  loading = input<boolean>(false);
  mockData = [
  { id: 1, name: 'James Butt', country: { name: 'Algeria', code: 'dz' }, status: 'unqualified', activity: 17 },
  { id: 2, name: 'Josephine Darakjy', country: { name: 'Egypt', code: 'eg' }, status: 'proposal', activity: 45 },
  { id: 3, name: 'Art Venere', country: { name: 'Panama', code: 'pa' }, status: 'qualified', activity: 88 },
  { id: 4, name: 'Lenna Paprocki', country: { name: 'Slovenia', code: 'si' }, status: 'new', activity: 25 },
  { id: 5, name: 'Donette Foller', country: { name: 'South Africa', code: 'za' }, status: 'negotiation', activity: 61 }
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
