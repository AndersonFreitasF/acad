import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  TreinoRepositoryPort,
  TreinoRepositoryPortToken,
} from "../application/ports/treino-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";

@Injectable()
export class DeleteTreinoService {
  constructor(
    @Inject(TreinoRepositoryPortToken)
    private readonly repo: TreinoRepositoryPort
  ) {}

  async execute(user: TokenPayload, id_treino: number) {
    try {

      const treinoExists = await this.repo.findTreino(id_treino);

      if (!treinoExists) {
        throw new NotFoundException("Treino não encontrado");
      }

      await this.repo.deleteExerciciosTreino(id_treino);

      await this.repo.deleteTreino(user.id_usuario, id_treino);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível excluir o treino"
      );
    }
  }
}

