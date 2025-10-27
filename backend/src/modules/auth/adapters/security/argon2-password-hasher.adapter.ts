import { Injectable } from "@nestjs/common";
import { PasswordHasherPort } from "../../application/ports/password-hasher.port";
import * as argon2 from "argon2";

@Injectable()
export class Argon2PasswordHasherAdapter implements PasswordHasherPort {
  async verify(senhaHasheada: string, senha: string): Promise<boolean> {
    return argon2.verify(senhaHasheada, senha);
  }

  async hash(senha: string): Promise<string> {
    return argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }
}
