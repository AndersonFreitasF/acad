import {
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
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

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
      const exercicioExists = await this.repo.findExercicio(id_exercicio);

      if (!exercicioExists) {
        throw new NotFoundException("Exercício não encontrado");
      }

      await this.repo.putExercicio(data, user.id_usuario, id_exercicio);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível atualizar o exercício"
      );
    }
  }
}
