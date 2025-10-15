import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { DeleteProfessorRepository } from "../repositories/deleteProfessor.repository";

@Injectable()
export class DeleteProfessorService {
  constructor(
    private readonly deleteProfessorRepository: DeleteProfessorRepository
  ) {}

  async execute(user: TokenPayload, id_usuario: number) {
    try {
      if (user.tipo !== Role.ADM) {
        throw new ForbiddenException(
          "Acesso negado: você só pode apagar sua própria conta"
        );
      }
      const existing =
        await this.deleteProfessorRepository.findUsuario(id_usuario);
      if (!existing) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.deleteProfessorRepository.deleteProfessor(
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível deletar o professor"
      );
    }
  }
}
