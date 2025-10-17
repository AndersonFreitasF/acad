import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";

@Injectable()
export class DeleteUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort
  ) {}

  async execute(user: TokenPayload, id_usuario: number) {
    try {
      // Validar ID positivo
      if (id_usuario <= 0) {
        throw new BadRequestException('ID inválido');
      }

      if (user.tipo !== Role.ADM && user.id_usuario !== id_usuario) {
        throw new ForbiddenException(
          "Acesso negado: você só pode apagar sua própria conta"
        );
      }

      const existing = await this.repo.findUsuario(id_usuario);
      if (!existing) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.repo.deleteUsuario(
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Não foi possível deletar o usuário");
    }
  }
}
