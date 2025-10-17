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
import { PutProfessorDataDTO } from "../dtos/putProfessorData.dto";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../../auth/application/ports/password-hasher.port";

@Injectable()
export class PutProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(
    data: PutProfessorDataDTO,
    user: TokenPayload,
    id_usuario: number
  ) {
    try {
      // Validar ID positivo
      if (id_usuario <= 0) {
        throw new BadRequestException('ID de professor inválido');
      }
      
      // Validar pelo menos um campo fornecido
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

      await this.repo.putProfessor(
        { ...data, senha: data.senha ? await this.passwordHasher.hash(data.senha) : null },
        user.id_usuario,
        id_usuario
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível atualizar o professor"
      );
    }
  }

}
