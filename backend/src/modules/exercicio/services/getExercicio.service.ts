import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetExercicioDataDTO } from "../dtos/getExercicioData.dto";
import { ExercicioRepositoryPort, ExercicioRepositoryPortToken } from "../application/ports/exercicio-repository.port";

@Injectable()
export class GetExercicioService {
  constructor(
    @Inject(ExercicioRepositoryPortToken)
    private readonly repo: ExercicioRepositoryPort
  ) {}

  async execute(data: GetExercicioDataDTO) {
    try {
      const TotalExercicios = await this.repo.countExercicios(data);

      const DadosExercicio = await this.repo.getExercicios(data);

      return {
        Exercicios: DadosExercicio ?? [],
        Total: TotalExercicios ?? 0,
        Pagina: data.page,
        Tamanho_Pagina: data.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível buscar os exercícios"
      );
    }
  }
}
