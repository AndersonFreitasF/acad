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
      console.log('Total usuarios:', TotalUsuarios);

      const DadosUsuario = await this.repo.getUsuarios(data);
      console.log('Dados usuario:', DadosUsuario);

      const response = {
        data: DadosUsuario ?? [],
        total: TotalUsuarios ?? 0,
        page: data.page,
        size: data.size,
      };
      console.log('Response final:', response);
      return response;
    } catch (error) {
      console.error('Erro no GetUsuarioService:', error);
      throw new InternalServerErrorException(
        "Não foi possível buscar os usuários"
      );
    }
  }
}
