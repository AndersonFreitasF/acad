import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";
const argon2 = require("argon2");

@Injectable()
export class PostUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort
  ) {}

  async execute(data: PostUsuarioDataDTO, created_by: number) {
    try {
      await this.repo.postUsuario(
        { ...data, senha: await this.hash(data.senha) },
        created_by
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o usuário"
      );
    }
  }

  async hash(senha: string) {
    return await argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }
}
