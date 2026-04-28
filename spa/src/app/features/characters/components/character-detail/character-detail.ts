import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

// PrimeNG 18 Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { Transformation,Detail,ModalCharacter } from '../../../../shared/interfaces/models/character.model';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { Image } from 'primeng/image'

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    TextareaModule, 
    SelectModule, 
    RadioButtonModule, 
    FileUploadModule,ProgressBarModule,CardModule,ImageModule,Image 
  ],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  public characterForm!: FormGroup;
  public isEditable!: boolean;
  public characterResponse!:Detail;
  // --- Variables Públicas ---
  public name!: string;
  public description!: string;
  public gender!: string;
  public id!: number;
  public image!: string;
  public ki!: string;
  public maxKi!: string;
  public race!: string;
  public affiliation!: any;
  public deletedAt!: any;

  // Variables del Planeta
  public idPlanet!: number;
  public deletedAtPlanet!: null | string | Date;
  public descriptionPlanet!: string;
  public imagePlanet!: string;
  public isDestroyed!: boolean;
  public namePlanet!: string;

  // Transformaciones
  public transformations: Transformation[] = [];

  races = [
    { label: 'Saiyan', value: 'Saiyan' },
    { label: 'Namekian', value: 'Namekian' },
    { label: 'Human', value: 'Human' }
  ];

  ngOnInit() {
    // Desestructuramos del objeto recibido (ModalCharacter)
    const { type, response:character,transformations:transformation } = this.config.data;
    this.characterResponse=character;
    console.log("informacion que llega del padre",this.config.data);
    const {
      name, description, gender, id, image, ki, maxKi, race, 
      affiliation, deletedAt, originPlanet, transformations 
    } = this.characterResponse;
    let namaTr: string = '';
    let imageTr: string = '';
    if (transformation) {
        ({ name: namaTr, image: imageTr } = transformation);
    }
        console.log(imageTr);
    // 2. Desestructuración del planeta
    const {
      id: idPl, deletedAt: delPl, description: descPl, 
      image: imgPl, isDestroyed: isDest, name: namePl 
    } = originPlanet;

    // 3. Asignación a variables públicas
    this.name = transformation?namaTr:name;
    this.description = description;
    this.gender = gender;
    this.id = id;
    this.image = transformation?imageTr:image;
    this.ki = ki;
    this.maxKi = maxKi;
    this.race = race;
    this.affiliation = affiliation;
    this.deletedAt = deletedAt;
    this.transformations = transformations || [];
    // Asignación de variables del planeta
    this.idPlanet = idPl;
    this.deletedAtPlanet = delPl;
    this.descriptionPlanet = descPl;
    this.imagePlanet = imgPl;
    this.isDestroyed = isDest;
    this.namePlanet = namePl;
    this.isEditable = type;
    this.characterForm = this.fb.group({
      name: [character.name, [Validators.required, Validators.maxLength(50)]],
      ki: [character.ki, [Validators.required]],
      maxKi: [character.maxKi, [Validators.required]],
      race: [character.race, Validators.required],
      gender: [character.gender, Validators.required],
      // AUMENTAMOS EL LIMITE AQUÍ:
      description: [character.description, [Validators.required, Validators.maxLength(1000)]], 
      // O quita 'affiliation' si no vas a poner un input para ella:
      affiliation: [character.affiliation] 
    });

    if (!this.isEditable) this.characterForm.disable();
  }

  onSave() {
    alert('Su personaje fue editado');
    this.ref.close(this.characterForm.value);
  }

  // En character-detail.ts

// En character-detail.ts

onFileSelect(event: any) {
  // PrimeNG 18 suele usar event.currentFiles o event.files
  const file = event.files ? event.files[0] : event.currentFiles[0];

  if (file) {
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      // Esto actualizará [src]="image" de tu img.img-render automáticamente
      this.image = e.target.result;
      console.log("Imagen actualizada correctamente");
    };

    reader.readAsDataURL(file);
  }
}

getKiPercentage(): number {
  const kiValue = this.characterForm.get('ki')?.value;
  const maxKiValue = this.characterForm.get('maxKi')?.value;

  if (!kiValue || !maxKiValue) return 0;

  // Limpiamos los puntos y convertimos a número
  const ki = parseFloat(kiValue.toString().replace(/\./g, ''));
  const maxKi = parseFloat(maxKiValue.toString().replace(/\./g, ''));

  if (isNaN(ki) || isNaN(maxKi)) return 0;

  const percentage = (ki / maxKi) * 100;
  return percentage > 100 ? 100 : percentage;
}

  onCancel() {
    this.ref.close();
  }
  abrirZoom(imgComponent: Image) {
    imgComponent.onImageClick();
  }
}
