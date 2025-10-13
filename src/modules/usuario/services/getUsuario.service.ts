import { Injectable } from "@nestjs/common";
import { GetUsuarioInputDto } from "../dtos/getUsuarioData.dto";
import { GetUsuarioRepository } from "../repository/getUsuario.repository";

@Injectable()
export class GetUsuarioService {
  constructor(private readonly getUsuarioRepository: GetUsuarioRepository) {}

  async execute(data: GetUsuarioInputDto) {
    console.log(data.page, data.size, typeof data.page, typeof data.size);

    const DadosUsuario = await this.getUsuarioRepository.getUsuarios(data);

    return {
      Usuarios: DadosUsuario ?? [],
      Total: DadosUsuario?.length ?? 0,
      Pagina: data.page,
      Tamanho_Pagina: data.size,
    };
  }
}
