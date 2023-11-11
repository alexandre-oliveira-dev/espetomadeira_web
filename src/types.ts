export enum ReleaseType {
    // Add your specific release types here if needed
    entrada='entrada',
    saida='saida'
}

// Interfaces
export interface Codes {
  code: string;
  name?: string | null;
}

export interface Releases {
  id?: string;
  data?: string | null;
  codigo?: string | null;
  descricao?: string | null;
  formpgm?: string | null;
  tipo?: string | null;
  valor?: number | null;
  pago_banco?: number | null;
  valor_detalhes?: string | null;
  usersId?: string | null;
  Users?: Users | null;
}

export interface Users {
  id: string;
  usuario?: string | null;
  senha?: string | null;
  Releases: Releases[];
}