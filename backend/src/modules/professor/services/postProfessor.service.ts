import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../../auth/application/ports/password-hasher.port";

@Injectable()
export class PostProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(data: PostProfessorDataDTO, created_by: number) {
    try {
      await this.repo.postUsuario(
        { ...data, senha: await this.passwordHasher.hash(data.senha) },
        created_by
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o professor"
      );
    }
  }

}
