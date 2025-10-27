import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";

@Injectable()
export class DeleteProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort
  ) {}

  async execute(user: TokenPayload, id_usuario: number) {
    try {

      if (user.tipo !== Role.ADM) {
        throw new ForbiddenException(
          "Acesso negado: você só pode apagar sua própria conta"
        );
      }
      const existing = await this.repo.findUsuario(id_usuario);
      if (!existing) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.repo.deleteProfessor(
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível deletar o professor"
      );
    }
  }
}
