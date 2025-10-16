import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";
import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";
const argon2 = require("argon2");

@Injectable()
export class PutUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort
  ) {}

  async execute(
    data: PutUsuarioDataDTO,
    user: TokenPayload,
    id_usuario: number
  ) {
    try {
      if (user.tipo !== Role.ADM && user.id_usuario !== id_usuario) {
        throw new ForbiddenException(
          "Acesso negado: você só pode editar sua própria conta"
        );
      }
      const usuarioExiste = await this.repo.findUsuario(id_usuario);
      if (!usuarioExiste) {
        throw new NotFoundException("Usuário não encontrado");
      }

      await this.repo.putUsuario(
        { ...data, senha: data.senha ? await this.hash(data.senha) : null },
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
        "Não foi possível atualizar o usuário"
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
