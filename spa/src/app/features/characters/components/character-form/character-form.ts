import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
import { MessageService } from 'primeng/api';
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
    CheckboxModule,
    ToastModule 
  ],
  templateUrl: './character-form.html',
  styleUrl: './character-form.scss',
})

export class CharacterForm implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  public characterForm!: FormGroup;

  // 1. SIGNALS DE ESTADO
  public imagePreview = signal<string | null>(null);
  
  public razas = signal([
    { label: 'Saiyan', value: 'Saiyan' },
    { label: 'Namekian', value: 'Namekian' },
    { label: 'Human', value: 'Human' },
    { label: 'Majin', value: 'Majin' },
    { label: 'Frieza Race', value: 'Frieza Race' },
    { label: 'Android', value: 'Android' },
    { label: 'God', value: 'God' },
    { label: 'Angel', value: 'Angel' },
    { label: 'Unknown', value: 'Unknown' }
  ]);

  public facciones = signal([
    { label: 'Guerrero Z', value: 'Z Fighter' },
    { label: 'Ejército de Freezer', value: 'Army of Frieza' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Villano', value: 'Villain' },
    { label: 'Androide', value: 'Android' },
    { label: 'Tropa del Orgullo', value: 'Pride Trooper' }
  ]);

  // 2. COMPUTED
  public planetaEstado = computed(() => {
    // Nota: El valor del formulario no dispara automáticamente el computed a menos que 
    // uses una señal para el valor. Por ahora funcionará al detectar cambios.
    const isDestroyed = this.characterForm?.get('originPlanet.isDestroyed')?.value;
    return isDestroyed ? '💥 Destruido' : '🌎 Vigente';
  });

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
    // Lógica de género
    const rawGender = (data.gender || '').trim().toLowerCase();
    let generoPrecargado = (rawGender === 'female' || rawGender === 'femenino') ? 'Femenino' : 'Masculino';

    // Lógica de fecha
    const rawDate = (data as any).date;
    const inicialFecha = rawDate ? new Date(rawDate) : new Date();
    const fechaValida = isNaN(inicialFecha.getTime()) ? new Date() : inicialFecha;

    const displayImage = selectedTrans ? selectedTrans.image : data.image;
    this.imagePreview.set(displayImage || null);

    this.characterForm = this.fb.group({
      id: [data.id],
      name: [selectedTrans ? selectedTrans.name : data.name, Validators.required],
      ki: [this.parseKi(data.ki), [Validators.required, Validators.min(0)]],
      maxKi: [this.parseKi(data.maxKi), [Validators.min(0)]],
      race: [data.race || ''],
      gender: [generoPrecargado, Validators.required],
      description: [data.description || ''],
      image: [displayImage || ''],
      affiliation: [data.affiliation || 'Z Fighter'],
      date: [fechaValida, Validators.required],
      originPlanet: this.fb.group({
        id: [data.originPlanet?.id],
        name: [data.originPlanet?.name || ''],
        isDestroyed: [data.originPlanet?.isDestroyed || false],
        description: [data.originPlanet?.description || ''],
        image: [data.originPlanet?.image || '']
      }),
      transformations: this.fb.array([])
    });

    if (data.transformations?.length > 0) {
      data.transformations.forEach(t => this.addTransformation(t));
    }
  }

  addTransformation(t?: Transformation) {
    const transGroup = this.fb.group({
      id: [t?.id || Date.now()],
      name: [t?.name || '', Validators.required],
      image: [t?.image || ''],
      ki: [this.parseKi(t?.ki), Validators.required],
      numericKi: [this.parseKi(t?.numericKi)],
      deletedAt: [t?.deletedAt || null]
    });
    this.transformationsArray.push(transGroup);
  }

  removeTransformation(index: number) {
    this.transformationsArray.removeAt(index);
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.imagePreview.set(base64);
        this.characterForm.patchValue({ image: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    if (this.characterForm.valid) {
      const finalObject: DetailEdit = { ...this.characterForm.value };
      console.log("DetailEdit",finalObject)
      this.messageService.add({ 
        severity: 'success', 
        summary: '¡Guardado!', 
        detail: `Personaje ${finalObject.name} actualizado.`, 
        life: 2000 
      });
      setTimeout(() => this.ref.close(finalObject), 600);
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Formulario Incompleto', 
        detail: 'Revisa los campos obligatorios.' 
      });
      this.characterForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.ref.close();
  }
}

