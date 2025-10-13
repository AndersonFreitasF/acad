import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PutUsuarioRepository } from "../repository/putUsuario.repository";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";
import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
const argon2 = require("argon2");

@Injectable()
export class PutUsuarioService {
  constructor(private readonly putUsuarioRepository: PutUsuarioRepository) {}

  async execute(
    data: PutUsuarioDataDTO,
    user: TokenPayload,
    id_usuario: number
  ) {
    const usuarioExiste =
      await this.putUsuarioRepository.findUsuario(id_usuario);
    if (!usuarioExiste) {
      throw new NotFoundException("Usuário não encontrado");
    }

    if (user.tipo !== Role.ADM && user.id_usuario !== id_usuario) {
      throw new ForbiddenException(
        "Acesso negado: você só pode editar sua própria conta"
      );
    }
    await this.putUsuarioRepository.putUsuario(
      { ...data, senha: data.senha ? await this.hash(data.senha) : undefined },
      user.id_usuario,
      id_usuario
    );
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
