import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
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
    const { response: character, transformations: selectedTrans } = this.config.data;
    this.initForm(character, selectedTrans);
  }

  private parseKi(val: any): number {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return val;
    const cleanVal = val.toString().replace(/[^0-9]/g, '');
    const num = Number(cleanVal);
    return isNaN(num) ? 0 : num;
  }

initForm(data: Detail, selectedTrans?: Transformation) {
  const rawGender = (data.gender || '').trim().toLowerCase();
  let generoPrecargado = 'Masculino'; // Default
  
  if (rawGender === 'female' || rawGender === 'femenino') {
    generoPrecargado = 'Femenino';
  } else if (rawGender === 'male' || rawGender === 'masculino') {
    generoPrecargado = 'Masculino';
  }

  const displayName = selectedTrans ? selectedTrans.name : data.name;
  const displayImage = selectedTrans ? selectedTrans.image : data.image;
  const rawDate = (data as any).date;
  const inicialFecha = rawDate ? new Date(rawDate) : new Date();
  const fechaValida = isNaN(inicialFecha.getTime()) ? new Date() : inicialFecha;

  this.characterForm = this.fb.group({
    id: [data.id],
    name: [displayName, Validators.required],
    ki: [this.parseKi(data.ki), [Validators.required, Validators.min(0)]],
    maxKi: [this.parseKi(data.maxKi), [Validators.min(0)]],
    race: [data.race || ''],
    gender: [generoPrecargado, Validators.required], 
    description: [data.description || ''],
    image: [displayImage || ''],
    affiliation: [data.affiliation || 'Z Fighter'],
    deletedAt: [data.deletedAt || null],
    date: [fechaValida, Validators.required], 

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

  // 4. Carga de transformaciones existentes
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
      // Construimos el objeto final
      const finalObject: DetailEdit = {
        ...formValue
      };
      console.log('--- OBJETO A GUARDAR ---');
      console.table(finalObject);
      alert("¡Se guardó correctamente el personaje: " + finalObject.name + "!");
      this.ref.close(finalObject);

    } else {
      console.error('El formulario tiene errores:', this.characterForm.errors);
      alert("¡Ups! Parece que hay un error. Por favor, revisa que todos los campos obligatorios estén llenos.");
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

}
