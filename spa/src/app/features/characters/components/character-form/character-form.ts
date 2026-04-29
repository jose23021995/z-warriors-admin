import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
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
import { ToastModule } from 'primeng/toast';
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
    { label: 'Z Fighter', value: 'Z Fighter' },
    { label: 'Villain', value: 'Villain' },
    { label: 'Android', value: 'Android' },
    { label: 'Pride Trooper', value: 'Pride Trooper' }
  ];

  // Getter para el FormArray de transformaciones (usado en el HTML)
  get transformationsArray() {
  return this.characterForm.get('transformations') as FormArray;
}

  ngOnInit() {
    // 1. Extraer datos del modal
    const { response: character, transformations: selectedTrans } = this.config.data;
    
    // 2. Inicializar el formulario con los datos cargados
    this.initForm(character, selectedTrans);
  }

  initForm(data: Detail, selectedTrans?: Transformation) {
    // Si viene una transformación específica (como en tu lógica previa), sobreescribimos nombre e imagen
    const displayName = selectedTrans ? selectedTrans.name : data.name;
    const displayImage = selectedTrans ? selectedTrans.image : data.image;

    this.characterForm = this.fb.group({
      // Campos principales
      id: [data.id],
      name: [displayName, Validators.required],
      ki: [data.ki || '0', Validators.required],
      maxKi: [data.maxKi || '0'],
      race: [data.race || ''],
      gender: [data.gender || 'Masculino'],
      description: [data.description || ''],
      image: [displayImage || ''],
      affiliation: [data.affiliation || 'Z Fighter'],
      deletedAt: [data.deletedAt || null],
      data: [new Date(), Validators.required], // Este es el campo 'data' del DetailEdit

      // Objeto anidado completo
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


    // 3. Llenar el FormArray con las transformaciones existentes
    if (data.transformations && data.transformations.length > 0) {
      data.transformations.forEach(t => this.addTransformation(t));
    }
  }

  // Método para añadir transformación (acepta datos existentes o crea una vacía)
  addTransformation(t?: Transformation) {
    const transGroup = this.fb.group({
      id: [t?.id || Date.now()],
      name: [t?.name || '', Validators.required],
      image: [t?.image || ''],
      ki: [t?.ki || '0', Validators.required],
      numericKi: [t?.numericKi || 0],
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
      
      // Construimos el objeto final tipo DetailEdit
      const finalObject: DetailEdit = {
        ...formValue,
        data: formValue.date // Mapeamos 'date' del form a 'data' de la interfaz
      };

      console.log('Enviando DetailEdit:', finalObject);
      this.ref.close(finalObject);
    } else {
      this.characterForm.markAllAsTouched();
    }
  }
    // Método para manejar la selección de imagen
  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Actualizamos el valor del campo 'image' en el formulario
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
