import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog'; // Añade DynamicDialogModule

// Tus componentes
import { HeadersComponent } from '../../../shared/components/headers/headers';
//componentes propios del componente padre
import { CharacterDetailComponent } from '../components/character-detail/character-detail'; 
import { CharacterForm } from '../components/character-form/character-form'; 
import { CharacterTable } from '../components/character-table/character-table';
//servicio para peticiones http 
import { CharacterService } from '../../../core/services/character.service';
import { Detail, Character } from '../../../shared/interfaces/models/character.model'
import { ProgressBarModule } from 'primeng/progressbar';
// Agrégalo al array de 'imports' de tu @Component

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

  // Cambiado a null para que coincida con lo que devuelve PrimeNG
  ref: DynamicDialogRef | undefined | null; 

  ngOnInit() {
    this.handleLoadData({ page: 1, limit: 10 });
  }

  abrirEdicion(guerrero: any) {
    console.log("guerrero",guerrero);
    // Usamos el componente real aquí
    this.ref = this.dialogService.open(CharacterDetailComponent, {
      header: `Informacion de ${guerrero.name}`,
      width: '50%',
      data: { id: guerrero.id, nombre: guerrero.name }
    });

    // El chequeo 'if (this.ref)' quita el error de "Object is possibly undefined"
    if (this.ref) {
      this.ref.onClose.subscribe((jsonRetorno: any) => {
        if (jsonRetorno) {
          console.log('Datos recibidos del hijo:', jsonRetorno);
          // Aquí puedes refrescar la tabla si el JSON indica éxito
        }
      });
    }
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
  // ... dentro de tu clase CharacterListComponent

 // En character-list.component.ts
  async handleCharacterUpdate(data:any) {
    const {character,type}=data;
    const {id}=character;
    const response:Detail = await this.charService.getCharacter(id); //importante
    if (!type) 
    {
      this.ref = this.dialogService.open(CharacterDetailComponent, {
        header: `Informacion de ${response.name}`, 
        width: '50%',
        data: {response}
      });  
    } else {
      this.ref = this.dialogService.open(CharacterForm, {
        header: `Editar a ${response.name}`, 
        width: '50%',
        data: {response}
      });  
    }
    
}
}



