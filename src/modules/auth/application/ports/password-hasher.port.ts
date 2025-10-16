export const PasswordHasherPortToken = "PasswordHasherPort" as const;

export interface PasswordHasherPort {
  verify(senhaHasheada: string, senha: string): Promise<boolean>;
  hash(senha: string): Promise<string>;
}
