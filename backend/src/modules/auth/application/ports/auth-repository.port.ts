export const AuthRepositoryPortToken = "AuthRepositoryPort" as const;

export interface AuthUser {
  id_usuario: number;
  nome: string;
  email: string;
  senha: string;
  tipo: "ADM" | "PROFESSOR" | "ALUNO";
}

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<AuthUser | null>;
}

