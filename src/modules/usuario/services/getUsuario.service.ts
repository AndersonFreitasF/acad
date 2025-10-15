import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUsuarioDataDTO } from "../dtos/getUsuarioData.dto";
import { GetUsuarioRepository } from "../repositories/getUsuario.repository";

@Injectable()
export class GetUsuarioService {
  constructor(private readonly getUsuarioRepository: GetUsuarioRepository) {}

  async execute(data: GetUsuarioDataDTO) {
    try {
      const TotalUsuarios = await this.getUsuarioRepository.countUsuarios(data);

      const DadosUsuario = await this.getUsuarioRepository.getUsuarios(data);

      return {
        Usuarios: DadosUsuario ?? [],
        Total: TotalUsuarios ?? 0,
        Pagina: data.page,
        Tamanho_Pagina: data.size,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível buscar os usuários"
      );
    }
  }
}
