export interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt: null | string | Date;
}

export interface ModalCharacter {
  type: boolean;
  data: Character; // Sugerencia: usa minúscula para evitar confusiones
}

export interface OriginPlanet {
  id:          number;
  name:        string;
  isDestroyed: boolean;
  description: string;
  image:       string;
  deletedAt:   null | string | Date;
}

export interface Transformation {
  id:        number;
  name:      string;
  image:     string;
  ki:        string;
  deletedAt: null | string | Date;
}

export interface Detail {
  id:              number;
  name:            string;
  ki:              string;
  maxKi:           string;
  race:            string;
  gender:          string;
  description:     string;
  image:           string;
  affiliation?:     string;
  deletedAt?:       null | string | Date;
  originPlanet:    OriginPlanet;
  transformations: Transformation[]; // Opcional
}