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

import { ModalCharacter } from '../../../../shared/interfaces/models/character.model';

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
    FileUploadModule
  ],
  templateUrl: './character-detail.html'
})
export class CharacterDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  public characterForm!: FormGroup;
  public isEditable!: boolean;
  public image!: string;

  races = [
    { label: 'Saiyan', value: 'Saiyan' },
    { label: 'Namekian', value: 'Namekian' },
    { label: 'Human', value: 'Human' }
  ];

  ngOnInit() {
    // Desestructuramos del objeto recibido (ModalCharacter)
    const { type, data:character } = this.config.data;
    console.log(character);
    this.isEditable = type;
    this.image = character.image;

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
  // PrimeNG entrega los archivos seleccionados en la propiedad 'files'
  const file = event.files[0]; 

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // 1. Aquí actualizamos la variable global 'this.image'
      // 2. Al cambiar, el [src] del HTML reacciona automáticamente
      this.image = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}


  onCancel() {
    this.ref.close();
  }
}
