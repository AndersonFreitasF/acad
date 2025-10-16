import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUsuarioDataDTO } from "../dtos/getUsuarioData.dto";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";

@Injectable()
export class GetUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort
  ) {}

  async execute(data: GetUsuarioDataDTO) {
    try {
      const TotalUsuarios = await this.repo.countUsuarios(data);

      const DadosUsuario = await this.repo.getUsuarios(data);

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
