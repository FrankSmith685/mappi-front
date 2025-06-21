export interface CapituloVideo {
    id: number;
    titulo: string;
    descripcion: string;
    video: string;
  }
  
  export interface CursoVideo {
    id: number;
    curso: string;
    instructor: string;
    instructorImg: string;
    cover: string;
    descripcion: string;
    Capitulos: CapituloVideo[];
  }
  
  // types.ts
export interface CapituloAudio {
  id: number;
  titulo: string;
  descripcion: string;
  audio: string;
}

export interface CursoAudio {
  id: number;
  curso: string;
  instructor: string;
  instructorImg: string;
  cover: string;
  descripcion: string;
  Capitulos: CapituloAudio[];
}
