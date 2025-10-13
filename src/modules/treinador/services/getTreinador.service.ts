import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetTreinadorDataDTO } from "../dtos/getTreinadorData.dto";
import { GetTreinadorRepository } from "../repositories/getTreinador.repository";

@Injectable()
export class GetTreinadorService {
  constructor(
    private readonly getTreinadorRepository: GetTreinadorRepository
  ) {}

  async execute(data: GetTreinadorDataDTO) {
    try {
      const TotalUsuarios =
        await this.getTreinadorRepository.countTreinadores(data);

      const DadosUsuario =
        await this.getTreinadorRepository.getTreinadores(data);

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
