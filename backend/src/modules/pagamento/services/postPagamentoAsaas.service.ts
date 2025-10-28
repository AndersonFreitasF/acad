import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostPagamentoAsaasDataDTO } from "../dtos/postPagamentoAsaasData.dto";
import { InternalPaymentStatus } from "../interface/asaas.interface";

@Injectable()
export class PostPagamentoAsaasService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(id_usuario: number, data: PostPagamentoAsaasDataDTO) {
    if (!data.value || data.value <= 0) {
      throw new BadRequestException("Valor inválido.");
    }

    const result = await this.pagamentoRepository.postPagamento({
      customerId: data.customerId,
      value: data.value,
      billingType: data.billingType,
      description: data.description,
      id_usuario,
    });

    await this.pagamentoRepository.savePagamento(
      id_usuario,
      result.id,
      data.value,
      data.billingType,
      InternalPaymentStatus.PENDING
    );

    return {
      success: true,
      message: "Pagamento gerado com sucesso!",
      payment: result,
    };
  }
}
