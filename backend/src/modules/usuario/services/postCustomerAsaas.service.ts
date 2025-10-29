import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import {
  UsuarioRepositoryPortToken,
  UsuarioRepositoryPort,
} from "../application/ports/usuario-repository.port";
import { AsaasCustomerResponse } from "../interface/usuario.interface";

@Injectable()
export class PostCustomerAsaasService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort
  ) {}

  async execute(id_usuario: number): Promise<AsaasCustomerResponse> {
    try {
      const dadosUsuario = await this.repo.getDadosUsuario(id_usuario);

      if (!dadosUsuario) {
        throw new NotFoundException("Usuário não encontrado");
      }

      const Customer = await this.repo.postCustomer({
        email: dadosUsuario.email,
        cpfCnpj: dadosUsuario.cpfCnpj,
        name: dadosUsuario.name,
      });
      await this.repo.vincularCustomerId(id_usuario, Customer.id);

      return Customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Erro ao criar cliente no Asaas: ${error.message}`
      );
    }
  }
}
