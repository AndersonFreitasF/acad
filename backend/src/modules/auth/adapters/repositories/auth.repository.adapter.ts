import { Injectable } from "@nestjs/common";
import { AuthRepositoryPort, AuthUser } from "../../application/ports/auth-repository.port";
import { AuthRepository } from "../../repository/auth.repository";

@Injectable()
export class AuthRepositoryAdapter implements AuthRepositoryPort {
  constructor(private readonly authRepo: AuthRepository) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    return this.authRepo.findByEmail(email);
  }
}

