import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetailComponent {
  // Inyectamos las referencias de PrimeNG
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  // Leemos los datos que mandó el padre
  id = this.config.data.id;
  nombre = this.config.data.nombre;

  enviarDatos() {
    const jsonRespuesta = {
      status: 'updated',
      updatedAt: new Date(),
      characterId: this.id,
      powerLevel: 'Over 9000!'
    };
    
    // Cierra el modal mandando el JSON de vuelta al padre
    this.ref.close(jsonRespuesta);
  }
}
