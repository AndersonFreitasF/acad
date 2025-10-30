export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo: 'ALUNO' | 'PROFESSOR' | 'ADM';
}

export interface Treino {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  id_professor: number;
  created_at: string;
}

export interface Exercicio {
  id: number;
  nome: string;
  descricao: string;
}

export interface CompraRequest {
  treinoId: number;
  metodo: 'PIX' | 'CREDIT_CARD';
  card?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  holderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
  };
}

export interface PixResponse {
  paymentId: string;
  qrCodeImage: string;
  copyPaste: string;
  expirationDate?: string;
}

export interface CardResponse {
  paymentId: string;
  status: string;
}

