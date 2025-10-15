import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostUsuarioRepository } from "../repositories/postUsuario.repository";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
const argon2 = require("argon2");

@Injectable()
export class PostUsuarioService {
  constructor(private readonly postUsuarioRepository: PostUsuarioRepository) {}

  async execute(data: PostUsuarioDataDTO, created_by: number) {
    try {
      await this.postUsuarioRepository.postUsuario(
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
