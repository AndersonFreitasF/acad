import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";
import { Role } from "src/common/enum/role.enum";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../../auth/application/ports/password-hasher.port";

@Injectable()
export class PutUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(
    data: PutUsuarioDataDTO,
    user: TokenPayload,
    id_usuario: number
  ) {
    try {
      if (!data.nome && !data.email && !data.senha) {
        throw new BadRequestException('Pelo menos um campo deve ser informado para atualização');
      }

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
        { ...data, senha: data.senha ? await this.passwordHasher.hash(data.senha) : null },
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível atualizar o usuário"
      );
    }
  }

}
