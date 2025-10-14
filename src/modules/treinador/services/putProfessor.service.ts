import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { PutProfessorDataDTO } from "../dtos/putProfessorData.dto";
import { PutProfessorRepository } from "../repositories/putProfessor.repository";
const argon2 = require("argon2");

@Injectable()
export class PutProfessorService {
  constructor(
    private readonly putProfessorRepository: PutProfessorRepository
  ) {}

  async execute(
    data: PutProfessorDataDTO,
    user: TokenPayload,
    id_usuario: number
  ) {
    try {
      if (user.tipo !== Role.ADM && user.id_usuario !== id_usuario) {
        throw new ForbiddenException(
          "Acesso negado: você só pode editar sua própria conta"
        );
      }
      const usuarioExiste =
        await this.putProfessorRepository.findUsuario(id_usuario);
      if (!usuarioExiste) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.putProfessorRepository.putProfessor(
        { ...data, senha: data.senha ? await this.hash(data.senha) : null },
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possivel criar o usuario"
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
