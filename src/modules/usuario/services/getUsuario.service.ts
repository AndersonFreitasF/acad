import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUsuarioInputDto } from "../dtos/getUsuarioData.dto";
import { GetUsuarioRepository } from "../repository/getUsuario.repository";

@Injectable()
export class GetUsuarioService {
  constructor(private readonly getUsuarioRepository: GetUsuarioRepository) {}

  async execute(data: GetUsuarioInputDto) {
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
        "Não foi possivel criar o usuario"
      );
    }
  }
}
