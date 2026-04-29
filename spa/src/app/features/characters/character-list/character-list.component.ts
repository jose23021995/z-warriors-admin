import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog'; // Añade DynamicDialogModule
import { HeadersComponent } from '../../../shared/components/headers/headers';
import { CharacterDetailComponent } from '../components/character-detail/character-detail'; 
import { CharacterForm } from '../components/character-form/character-form'; 
import { CharacterTable } from '../components/character-table/character-table';
import { CharacterService } from '../../../core/services/character.service';
import { Detail } from '../../../shared/interfaces/models/character.model'
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    HeadersComponent,
    CardModule,
    CharacterTable,
    ProgressSpinnerModule,
    DynamicDialogModule,
    ProgressBarModule 
  ],
  providers: [
    DialogService
  ],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent implements OnInit {
  private charService = inject(CharacterService);
  private dialogService = inject(DialogService); // Usando inject para consistencia

  characters = signal<any[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(false);

  ref: DynamicDialogRef | undefined | null; 

  ngOnInit() {
    this.handleLoadData({ page: 1, limit: 10 });
  }

  abrirEdicion(guerrero: any) {
    console.log("guerrero",guerrero);
    this.ref = this.dialogService.open(CharacterDetailComponent, {
      header: `Informacion de ${guerrero.name}`,
      width: '50%',
      data: { id: guerrero.id, nombre: guerrero.name }
    });

    if (this.ref) {
      this.ref.onClose.subscribe((jsonRetorno: any) => {
        if (jsonRetorno) {
          console.log('Datos recibidos del hijo:', jsonRetorno);
        }
      });
    }
  }

   async handleLoadData(event: { page: number; limit: number; search?: string }) {
    try {
      this.isLoading.set(true);
      const response = await this.charService.getCharacters(event.page, event.limit, event.search);
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

  async handleCharacterUpdate(data:any) {
    const {character,type}=data;
    const {id}=character;
    const response:Detail = await this.charService.getCharacter(id);
    if (!type) 
    {
      this.ref = this.dialogService.open(CharacterDetailComponent, {
        header: `Informacion de ${response.name}`, 
        width: '60%',
        data: {response}
      });  
    } else {
      this.ref = this.dialogService.open(CharacterForm, {
        header: `Editar a ${response.name}`, 
        width: '90%',
        data: {response}
      });  
    }
    
  }
}



