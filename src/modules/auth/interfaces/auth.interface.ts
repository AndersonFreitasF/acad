export interface TokenPayload {
  id_usuario: number;
  tipo: "ADM" | "PROFESSOR" | "ALUNO";
}

export interface TokenData {
  accessToken: string;
  expiresIn: number;
}
