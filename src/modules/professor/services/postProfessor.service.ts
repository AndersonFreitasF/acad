import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";
import { PostProfessorRepository } from "../repositories/postProfessor.repository";
const argon2 = require("argon2");

@Injectable()
export class PostProfessorService {
  constructor(
    private readonly postProfessorRepository: PostProfessorRepository
  ) {}

  async execute(data: PostProfessorDataDTO, created_by: number) {
    try {
      await this.postProfessorRepository.postUsuario(
        { ...data, senha: await this.hash(data.senha) },
        created_by
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o professor"
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
