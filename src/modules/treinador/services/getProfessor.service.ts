import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";
import { GetProfessorRepository } from "../repositories/getProfessor.repository";

@Injectable()
export class GetProfessorService {
  constructor(
    private readonly getProfessorRepository: GetProfessorRepository
  ) {}

  async execute(data: GetProfessorDataDTO) {
    try {
      const TotalUsuarios =
        await this.getProfessorRepository.countProfessores(data);

      const DadosUsuario =
        await this.getProfessorRepository.getProfessores(data);

      return {
        Usuarios: DadosUsuario ?? [],
        Total: TotalUsuarios ?? 0,
        Pagina: data.page,
        Tamanho_Pagina: data.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possivel criar o usuario"
      );
    }
  }
}
