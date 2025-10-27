import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "../../../../backend/node_modules/@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostCustomerAsaasDataDTO } from "../dtos/postCustomerAsaasData.dto";
import { AsaasCustomerResponse } from "../interface/asaas.interface";

@Injectable()
export class PostCustomerAsaasService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(id_usuario: number): Promise<AsaasCustomerResponse> {
    try {
      const dadosUsuario = await this.pagamentoRepository.getDadosUsuario(
        id_usuario
      );

      if (!dadosUsuario) {
        throw new NotFoundException("Usuário não encontrado");
      }

      const Customer = await this.pagamentoRepository.postCustomer({
        email: dadosUsuario.email,
        cpfCnpj: dadosUsuario.cpfCnpj,
        name: dadosUsuario.name,
      });
      await this.pagamentoRepository.vincularCustomerId(
        id_usuario,
        Customer.id
      );

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
