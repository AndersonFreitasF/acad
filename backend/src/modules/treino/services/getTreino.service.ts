import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetTreinoDataDTO } from "../dtos/getTreinoData.dto";
import { TreinoRepositoryPort, TreinoRepositoryPortToken } from "../application/ports/treino-repository.port";

@Injectable()
export class GetTreinoService {
  constructor(
    @Inject(TreinoRepositoryPortToken)
    private readonly repo: TreinoRepositoryPort
  ) {}

  async execute(data: GetTreinoDataDTO) {
    try {
      const TotalTreinos = await this.repo.countTreinos(data);

      const DadosTreino = await this.repo.getTreinos(data);

      return {
        Treinos: DadosTreino ?? [],
        Total: TotalTreinos ?? 0,
        Pagina: data.page,
        Tamanho_Pagina: data.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível buscar os treinos"
      );
    }
  }
}

