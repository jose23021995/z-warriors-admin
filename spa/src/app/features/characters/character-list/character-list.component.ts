import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog'; // Añade DynamicDialogModule

// Tus componentes
import { HeadersComponent } from '../../../shared/components/headers/headers';
import { TableComponent } from '../../../shared/components/table/table';
import { CharacterService } from '../../../core/services/character.service';

// IMPORTANTE: Sustituye esto por la ruta real de tu componente modal
// Si aún no lo creas, puedes crear uno rápido con 'ng g c features/characters/character-detail'
import { CharacterDetailComponent } from '../character-detail/character-detail'; 

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    HeadersComponent,
    CardModule,
    TableComponent,
    ProgressSpinnerModule,
    DynamicDialogModule // <--- EL MÓDULO VA AQUÍ
  ],
  providers: [
    DialogService // <--- EL SERVICIO VA AQUÍ
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
    // Usamos el componente real aquí
    this.ref = this.dialogService.open(CharacterDetailComponent, {
      header: `Editar a ${guerrero.name}`,
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
}



