import { Component,Input  } from '@angular/core';


@Component({
  selector: 'app-headers',
  imports: [],
  templateUrl: './headers.html',
  styleUrl: './headers.scss',
})
export class HeadersComponent  {
  @Input() title: string = 'Título por defecto';
}
