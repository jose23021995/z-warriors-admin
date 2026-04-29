import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { ImageModule, Image } from 'primeng/image';

// Interfaces
import { Transformation, Detail } from '../../../../shared/interfaces/models/character.model';

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
    FileUploadModule,
    ProgressBarModule,
    CardModule,
    ImageModule
  ],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  public characterForm!: FormGroup;

  // --- SIGNALS DE ESTADO (Visualización) ---
  public name = signal<string>('');
  public description = signal<string>('');
  public gender = signal<string>('');
  public id = signal<number | null>(null);
  public image = signal<string>('');
  public ki = signal<string>('');
  public maxKi = signal<string>('');
  public race = signal<string>('');
  public affiliation = signal<any>(null);
  public deletedAt = signal<any>(null);
  public idPlanet = signal<number | null>(null);
  public descriptionPlanet = signal<string>('');
  public imagePlanet = signal<string>('');
  public isDestroyed = signal<boolean>(false);
  public namePlanet = signal<string>('');
  public deletedAtPlanet = signal<any>(null);

  public transformations = signal<Transformation[]>([]);

  public planetaEstado = computed(() => 
    this.isDestroyed() ? '💥 Destruido' : '🌎 Vigente'
  );

  ngOnInit() {
    const { response: character, transformations: transformation } = this.config.data;
    
    if (!character) return;

    this.name.set(transformation?.name || character.name);
    this.image.set(transformation?.image || character.image);
    this.description.set(character.description);
    this.gender.set(character.gender);
    this.id.set(character.id);
    this.ki.set(character.ki);
    this.maxKi.set(character.maxKi);
    this.race.set(character.race);
    this.affiliation.set(character.affiliation);
    this.deletedAt.set(character.deletedAt);
    this.transformations.set(character.transformations || []);

    const planet = character.originPlanet;
    if (planet) {
      this.idPlanet.set(planet.id);
      this.namePlanet.set(planet.name);
      this.descriptionPlanet.set(planet.description);
      this.imagePlanet.set(planet.image);
      this.isDestroyed.set(planet.isDestroyed);
      this.deletedAtPlanet.set(planet.deletedAt);
    }

    this.characterForm = this.fb.group({});
  }

  onCancel() {
    this.ref.close();
  }

  abrirZoom(imgComponent: Image) {
    imgComponent.onImageClick();
  }
}
