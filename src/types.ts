export enum ReleaseType {
  // Add your specific release types here if needed
  entrada = 'entrada',
  saida = 'saida',
}

export enum PaymentMethod {
  pix = 'pix',
  boleto = 'boleto',
  credtCard = 'cartão de crédito',
  debitCard = 'cartão de débito',
  money = 'dinheiro',
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
  status?: string | null;
  Users?: Users | null;
}

export interface Users {
  id: string;
  usuario?: string | null;
  senha?: string | null;
  Releases: Releases[];
}

export interface FindManyArgs {
  where?: Releases;
  take?: number;
}
export type BankBalanceUncheckedCreateInput = {
  id?: string;
  balance?: number;
  updated_at?: Date | string;
};

export type WalletUncheckedCreateInput = {
  id?: string;
  balance?: number;
  updated_at?: Date | string;
};
