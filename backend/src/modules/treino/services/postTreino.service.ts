import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { TreinoRepositoryPort, TreinoRepositoryPortToken } from "../application/ports/treino-repository.port";
import { PostTreinoDataDTO } from "../dtos/postTreinoData.dto";
import { Treino } from "../interface/treino.interface";

@Injectable()
export class PostTreinoService {
  constructor(
    @Inject(TreinoRepositoryPortToken)
    private readonly repo: TreinoRepositoryPort
  ) {}

  async execute(data: PostTreinoDataDTO, id_professor: number): Promise<Treino> {
    try {

      const treino = await this.repo.postTreino(data, id_professor);
      
      if (!treino || !treino.id) {
        throw new Error("Falha ao criar o treino");
      }

      const treinoExists = await this.repo.treinoExists(treino.id);
      if (!treinoExists) {
        throw new Error("Treino não foi criado corretamente");
      }

      for (let i = 0; i < data.exercicios.length; i++) {
        await this.repo.addExercicio(data.exercicios[i], treino.id, i + 1);
      }

      return treino;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao criar treino: ${error.message}`);
    }
  }
}
