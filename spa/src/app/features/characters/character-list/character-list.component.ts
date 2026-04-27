import { Component, OnInit, inject, signal  } from '@angular/core';
import { HeadersComponent } from '../../../shared/components/headers/headers'; // Importa la ruta correcta
import { CardModule } from 'primeng/card';
import {TableComponent} from '../../../shared/components/table/table';

@Component({
  selector: 'app-character-list',
  imports: [HeadersComponent,CardModule,TableComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
})
export class CharacterListComponent {}
