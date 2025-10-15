import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { DeleteUsuarioRepository } from "../repositories/deleteUsuario.repository";

@Injectable()
export class DeleteUsuarioService {
  constructor(
    private readonly deleteUsuarioRepository: DeleteUsuarioRepository
  ) {}

  async execute(user: TokenPayload, id_usuario: number) {
    try {
    if (user.tipo !== Role.ADM && user.id_usuario !== id_usuario) {
      throw new ForbiddenException(
        "Acesso negado: você só pode apagar sua própria conta"
      );
    }

      const existing =
        await this.deleteUsuarioRepository.findUsuario(id_usuario);
      if (!existing) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.deleteUsuarioRepository.deleteUsuario(
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
if (error instanceof NotFoundException) {
        throw error;
      }else if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(       "Não foi possível deletar o usuário"
      );
    }
  }
}
