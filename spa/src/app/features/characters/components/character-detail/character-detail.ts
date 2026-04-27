import { Component,OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { Character,ModalCharacter } from '../../../../shared/interfaces/models/character.model'
@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetailComponent implements OnInit {
  // Inyectamos las referencias de PrimeNG
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public objetoCompleto!:ModalCharacter;
  public isEditable!: boolean;
  public character!: Character;
  public id!: number;
  public name!: string;
  public ki!: string;
  public maxKi!: string;
  public race!: string;
  public gender!: string;
  public description!: string;
  public image!: string;
  public affiliation!: string;

  
  ngOnInit() {
      // Capturamos TODO lo que venga en data
      const {data}=this.config;
      this.objetoCompleto = data;
      const { type:modaltype, Character } = this.objetoCompleto;
      this.isEditable = modaltype;
      this.character = Character;
      const { id, name, ki, maxKi, race, gender, description, image, affiliation }=this.character;
      this.id = id;
      this.name = name;
      this.ki = ki;
      this.maxKi = maxKi;
      this.race = race;
      this.gender = gender;
      this.description = description;
      this.image = image;
      this.affiliation = affiliation;
      // Imprimimos el objeto tal cual llegó
      console.log("Hijo (Modal) recibió el objeto íntegro:", this.objetoCompleto);
    }

  // Leemos los datos que mandó el padre

  enviarDatos() {
    console.log("datos para obtener",this.config.data);
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
