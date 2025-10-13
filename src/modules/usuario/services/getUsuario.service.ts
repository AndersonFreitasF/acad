import { Injectable } from "@nestjs/common";
import { GetUsuarioInputDto } from "../dtos/getUsuarioData.dto";
import { GetUsuarioRepository } from "../repository/getUsuario.repository";

@Injectable()
export class GetUsuarioService {
  constructor(private readonly getUsuarioRepository: GetUsuarioRepository) {}

  async execute(data: GetUsuarioInputDto) {
    const TotalUsuarios = await this.getUsuarioRepository.countUsuarios();

    const DadosUsuario = await this.getUsuarioRepository.getUsuarios(data);

    return {
      Usuarios: DadosUsuario ?? [],
      Total: TotalUsuarios ?? 0,
      Pagina: data.page,
      Tamanho_Pagina: data.size,
    };
  }
}
