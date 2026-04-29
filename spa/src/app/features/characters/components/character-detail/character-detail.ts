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
    FileUploadModule,
    ProgressBarModule,
    CardModule,
    ImageModule,
    Image 
  ],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetailComponent implements OnInit {
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
  // Transformaciones
  public transformations: Transformation[] = [];
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
    this.transformations = transformations || [];
    this.idPlanet = idPl;
    this.deletedAtPlanet = delPl;
    this.descriptionPlanet = descPl;
    this.imagePlanet = imgPl;
    this.isDestroyed = isDest;
    this.namePlanet = namePl;
    this.characterForm = this.fb.group({});
  }
  onCancel() {
    this.ref.close();
  }
  abrirZoom(imgComponent: Image) {
    imgComponent.onImageClick();
  }
}
