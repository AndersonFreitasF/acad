import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostPagamentoAsaasDataDTO } from "../dtos/postPagamentoAsaasData.dto";
import { PostPagamentoAsaasRepository } from "../repositories/postPagamentoAsaas.repository";

@Injectable()
export class PostPagamentoAsaasService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort,
    private readonly pagamentoLocalRepository: PostPagamentoAsaasRepository
  ) {}

  async execute(id_usuario: number, data: PostPagamentoAsaasDataDTO) {
    const customerId =
      await this.pagamentoLocalRepository.getCustomerId(id_usuario);
    if (!customerId) {
      throw new NotFoundException(
        "Usuário não possui customer vinculado no Asaas"
      );
    }

    return this.pagamentoRepository.postPagamento({
      customerId,
      value: data.value,
      billingType: data.billingType,
      description: data.description ?? "Pagamento gerado pelo sistema",
    });
  }
}
