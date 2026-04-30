
import { Component, input, signal, output,Output,Input,EventEmitter, computed } from '@angular/core';
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
import { Character } from '../../../../../../shared/interfaces/models/character.model'
@Component({
  selector: 'app-character-table',
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
  templateUrl: './character-table.html',
  styleUrl: './character-table.scss',
})

export class CharacterTable {
  characters = input<any[]>([]); 
  totalRecords = input<number>(0); 
  loading = input<boolean>(false);
  onLoadData = output<{ page: number, limit: number, search?: string }>();
  
  searchQuery = signal<string>('');
  rows = signal<number>(10);

  displayData = computed(() => this.characters());
  displayTotal = computed(() => this.totalRecords());
  
  @Output() onCharacterSelected = new EventEmitter<any>();

  loadCharactersLazy(event: TableLazyLoadEvent) {
    if (typeof event.rows === 'number') {
      this.rows.set(event.rows);
    }
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
    search: this.searchQuery()
  });
}

getKiPercentage(ki: string, maxKi: string): number {
  const current = parseFloat(ki.replace(/\./g, ''));
  const max = parseFloat(maxKi.replace(/\./g, ''));
  if (isNaN(current) || isNaN(max)) return 100; 
  
  return (current / max) * 100;
}

  getRaceSeverity(race: string): "success" | "info" | "warn" | "danger" | "secondary" | undefined {
    const r = race?.toLowerCase();
    if (r === 'saiyan') return 'warn';
    if (r === 'human') return 'info';
    if (r === 'namekian') return 'success';
    if (r === 'frieza race') return 'danger';
    return 'secondary';
  }

  returnInformationModal(character: Character,type:any) { 
    console.log("tabla",character);
    this.onCharacterSelected.emit({character,type});
  }
}

