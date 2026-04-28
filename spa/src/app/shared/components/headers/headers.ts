import { Component,Input  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headers',
  imports: [CommonModule],
  templateUrl: './headers.html',
  styleUrl: './headers.scss',
})
export class HeadersComponent  {
  @Input() title: string = 'Título por defecto';
}
