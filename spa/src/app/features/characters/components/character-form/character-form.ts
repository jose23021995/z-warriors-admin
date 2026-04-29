import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
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
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-character-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    TextareaModule, 
    SelectModule, 
    RadioButtonModule, 
    FileUploadModule,
    ProgressBarModule,
    CardModule,
    ImageModule,
    DatePickerModule,
    InputNumberModule, // <--- Necesario para p-inputNumber y su propiedad [min]
    DatePickerModule,  // <--- Necesario para p-datepicker
  ],
  templateUrl: './character-form.html',
  styleUrl: './character-form.scss',
})
export class CharacterForm implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  public characterForm!: FormGroup;
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
  public date!:any;
  // Transformaciones
  public transformations: Transformation[] = [];
  public facciones = [
    { label: 'Z Fighter', value: 'Z Fighter' },
    { label: 'Villain', value: 'Villain' },
    { label: 'Android', value: 'Android' },
    { label: 'Pride Trooper', value: 'Pride Trooper' }
  ];
  public personajeForm!: FormGroup;

  ngOnInit() {
    const { response:character,transformations:transformation } = this.config.data;
    console.log("entrando a modal",this.config.data);
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
      this.idPlanet = idPl;
      this.deletedAtPlanet = delPl;
      this.descriptionPlanet = descPl;
      this.imagePlanet = imgPl;
      this.isDestroyed = isDest;
      this.namePlanet = namePl;

      this.transformations = transformations || [];
      this.personajeForm = new FormGroup({
      name: new FormControl(this.name || ''),
      affiliation: new FormControl(this.affiliation || 'Z Fighter'),
      ki: new FormControl(this.ki || 0, [Validators.required, Validators.min(0)]),
      fechaRegistro: new FormControl(new Date()), // Campo inventado
      description: new FormControl(this.description || ''),
      // ... agrega el resto de variables aquí
    });

  }
  
  onCancel() {
    this.ref.close();
  }
  guardarCambios() {
    if (this.personajeForm.valid) {
      // Aquí asignamos la fecha como pediste originalmente
      this.date = new Date().toISOString(); 
      
      console.log('¡Datos del Saiyan listos!', this.personajeForm.value);
      // Aquí iría tu lógica para enviar al backend o servicio
    } else {
      // Esto marca los errores en rojo si el formulario no es válido
      this.personajeForm.markAllAsTouched();
    }
  }

  // También agrega una función para el botón regresar si lo tienes en el HTML
  regresar() {
    console.log('Regresando...');
  }
}
