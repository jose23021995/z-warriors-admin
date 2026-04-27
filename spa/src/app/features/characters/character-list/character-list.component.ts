import { Component } from '@angular/core';
import { HeadersComponent } from '../../../shared/components/headers/headers'; // Importa la ruta correcta
@Component({
  selector: 'app-character-list',
  imports: [HeadersComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent {}
