export interface TokenPayload {
  id: number;
  tipo: "ADM" | "PROFESSOR" | "ALUNO";
}

export interface TokenData {
  accessToken: string;
  expiresIn: number;
}
