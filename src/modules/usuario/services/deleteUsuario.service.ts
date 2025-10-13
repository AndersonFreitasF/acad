import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { DeleteUsuarioRepository } from "../repository/deleteUsuario.repository";

@Injectable()
export class DeleteUsuarioService {
  constructor(
    private readonly deleteUsuarioRepository: DeleteUsuarioRepository
  ) {}

  async execute(user: TokenPayload, id_usuario: number) {
    try {
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
      throw new InternalServerErrorException(
        "Não foi possivel criar o usuario"
      );
    }
  }
}
