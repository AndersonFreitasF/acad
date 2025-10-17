import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../../auth/application/ports/password-hasher.port";

@Injectable()
export class PostUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(data: PostUsuarioDataDTO, created_by: number) {
    try {
      await this.repo.postUsuario(
        { ...data, senha: await this.passwordHasher.hash(data.senha) },
        created_by
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o usuário"
      );
    }
  }

}
