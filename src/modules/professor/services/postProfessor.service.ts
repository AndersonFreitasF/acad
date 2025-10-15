import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";
const argon2 = require("argon2");

@Injectable()
export class PostProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort
  ) {}

  async execute(data: PostProfessorDataDTO, created_by: number) {
    try {
      await this.repo.postUsuario(
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
