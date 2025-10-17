import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  ExercicioRepositoryPort,
  ExercicioRepositoryPortToken,
} from "../application/ports/exercicio-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";

@Injectable()
export class DeleteExercicioService {
  constructor(
    @Inject(ExercicioRepositoryPortToken)
    private readonly repo: ExercicioRepositoryPort
  ) {}

  async execute(user: TokenPayload, id_exercicio: number) {
    try {

      const exercicioExists = await this.repo.findExercicio(id_exercicio);

      if (!exercicioExists) {
        throw new NotFoundException("Exercício não encontrado");
      }

      await this.repo.deleteExercicio(user.id_usuario, id_exercicio);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível excluir o exercício"
      );
    }
  }
}
