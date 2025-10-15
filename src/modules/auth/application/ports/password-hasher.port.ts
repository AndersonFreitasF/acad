export const PasswordHasherPortToken = "PasswordHasherPort" as const;

export interface PasswordHasherPort {
  verify(hashedPassword: string, plainPassword: string): Promise<boolean>;
  hash(plainPassword: string): Promise<string>;
}

