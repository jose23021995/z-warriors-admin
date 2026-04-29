import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

// PrimeNG 18 Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

import Swal from 'sweetalert2'

// Interfaces
import { Transformation, Detail, DetailEdit } from '../../../../shared/interfaces/models/character.model';

@Component({
  selector: 'app-character-form',
  standalone: true,
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
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './character-form.html',
  styleUrl: './character-form.scss',
})
export class CharacterForm implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  public characterForm!: FormGroup;
  
  public razas = [
    { label: 'Saiyan', value: 'Saiyan' },
    { label: 'Namekian', value: 'Namekian' },
    { label: 'Human', value: 'Human' },
    { label: 'Majin', value: 'Majin' },
    { label: 'Frieza Race', value: 'Frieza Race' },
    { label: 'Android', value: 'Android' },
    { label: 'God', value: 'God' },
    { label: 'Angel', value: 'Angel' },
    { label: 'Unknown', value: 'Unknown' }
  ];

  public facciones = [
    { label: 'Guerrero Z', value: 'Z Fighter' },
    { label: 'Ejército de Freezer', value: 'Army of Frieza' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Villano', value: 'Villain' },
    { label: 'Androide', value: 'Android' },
    { label: 'Tropa del Orgullo', value: 'Pride Trooper' }
  ];

  get transformationsArray() {
    return this.characterForm.get('transformations') as FormArray;
  }

  ngOnInit() {
    // 1. Extraer datos del modal
    const { response: character, transformations: selectedTrans } = this.config.data;
    
    // 2. Inicializar el formulario
    this.initForm(character, selectedTrans);
  }

  /**
   * Limpia valores de Ki que vengan como String con formato (ej: "20.000")
   * y los convierte en números puros para evitar el error NaN.
   */
  private parseKi(val: any): number {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;

    // Eliminamos cualquier caracter que no sea número (puntos, comas, espacios)
    const cleanVal = val.toString().replace(/[^0-9]/g, '');
    const num = Number(cleanVal);

    return isNaN(num) ? 0 : num;
  }

  initForm(data: Detail, selectedTrans?: Transformation) {
    // Traducción de Género: API (Male/Female) -> Formulario (Masculino/Femenino)
    let generoPrecargado = data.gender;
    if (data.gender === 'Male') generoPrecargado = 'Masculino';
    if (data.gender === 'Female') generoPrecargado = 'Femenino';

    const displayName = selectedTrans ? selectedTrans.name : data.name;
    const displayImage = selectedTrans ? selectedTrans.image : data.image;
    
    // Manejo de la fecha raíz (DetailEdit.date)
    const inicialFecha = (data as any).date ? new Date((data as any).date) : new Date();

    this.characterForm = this.fb.group({
      id: [data.id],
      name: [displayName, Validators.required],
      // Aplicamos parseKi para manejar números grandes sin NaN
      ki: [this.parseKi(data.ki), [Validators.required, Validators.min(0)]],
      maxKi: [this.parseKi(data.maxKi), [Validators.min(0)]],
      race: [data.race || ''],
      gender: [generoPrecargado || 'Masculino'],
      description: [data.description || ''],
      image: [displayImage || ''],
      affiliation: [data.affiliation || 'Z Fighter'],
      deletedAt: [data.deletedAt || null],
      date: [inicialFecha, Validators.required], 

      originPlanet: this.fb.group({
        id: [data.originPlanet?.id],
        name: [data.originPlanet?.name || ''],
        isDestroyed: [data.originPlanet?.isDestroyed || false],
        description: [data.originPlanet?.description || ''],
        image: [data.originPlanet?.image || ''],
        deletedAt: [data.originPlanet?.deletedAt || null]
      }),

      transformations: this.fb.array([])
    });

    // Llenar el FormArray con las transformaciones existentes
    if (data.transformations && data.transformations.length > 0) {
      data.transformations.forEach(t => this.addTransformation(t));
    }
  }

  addTransformation(t?: Transformation) {
    const transGroup = this.fb.group({
      id: [t?.id || Date.now()],
      name: [t?.name || '', Validators.required],
      image: [t?.image || ''],
      // También limpiamos los Ki dentro de las transformaciones
      ki: [this.parseKi(t?.ki), Validators.required],
      numericKi: [this.parseKi(t?.numericKi)],
      deletedAt: [t?.deletedAt || null]
    });
    this.transformationsArray.push(transGroup);
  }

  removeTransformation(index: number) {
    this.transformationsArray.removeAt(index);
  }

guardarCambios() {
  if (this.characterForm.valid) {
    const formValue = this.characterForm.value;
    const finalObject: DetailEdit = { ...formValue };
    alert("Los cambios se han registrado correctamente");
    this.ref.close(finalObject);
  } else {
    alert("Por favor, revisa los campos marcados en rojo");
    this.characterForm.markAllAsTouched();
  }
}

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.characterForm.patchValue({
          image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel() {
    this.ref.close();
  }

  regresar() {
    this.ref.close();
  }
}
