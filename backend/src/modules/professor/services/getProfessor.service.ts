import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";

@Injectable()
export class GetProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort
  ) {}

  async execute(data: GetProfessorDataDTO) {
    try {
      const TotalUsuarios = await this.repo.countProfessores(data);
      const DadosUsuario = await this.repo.getProfessores(data);

      return {
        Usuarios: DadosUsuario ?? [],
        Total: TotalUsuarios ?? 0,
        Pagina: data.page,
        Tamanho_Pagina: data.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível buscar os professores"
      );
    }
  }
}
