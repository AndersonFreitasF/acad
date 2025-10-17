import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PutExercicioDataDTO } from "../dtos/putExercicioData.dto";
import {
  ExercicioRepositoryPort,
  ExercicioRepositoryPortToken,
} from "../application/ports/exercicio-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";

@Injectable()
export class PutExercicioService {
  constructor(
    @Inject(ExercicioRepositoryPortToken)
    private readonly repo: ExercicioRepositoryPort
  ) {}

  async execute(
    data: PutExercicioDataDTO,
    user: TokenPayload,
    id_exercicio: number
  ) {
    try {
      // Validar ID positivo
      if (id_exercicio <= 0) {
        throw new BadRequestException('ID de exercício inválido');
      }
      
      // Validar pelo menos um campo fornecido
      if (!data.nome && !data.descricao) {
        throw new BadRequestException('Pelo menos um campo deve ser informado para atualização');
      }

      const exercicioExists = await this.repo.findExercicio(id_exercicio);

      if (!exercicioExists) {
        throw new NotFoundException("Exercício não encontrado");
      }

      await this.repo.putExercicio(data, user.id_usuario, id_exercicio);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível atualizar o exercício"
      );
    }
  }
}
