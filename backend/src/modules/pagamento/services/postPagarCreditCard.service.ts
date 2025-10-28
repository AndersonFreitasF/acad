import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostPagarDataDTO } from "../dtos/postPagarData.dto";
import { InternalPaymentStatus } from "../interface/asaas.interface";

@Injectable()
export class PostPagarCreditCardService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(data: PostPagarDataDTO) {
    const pagamento = await this.pagamentoRepository.getPagamentoById(
      data.id_pagamento
    );
    if (!pagamento) throw new NotFoundException("Pagamento não encontrado");

    if (pagamento.status === InternalPaymentStatus.PAID) {
      throw new BadRequestException("Pagamento já realizado");
    }

    const paymentResult = await this.pagamentoRepository.payPayment(data);

    return {
      success: true,
      message: "Pagamento processado com sucesso",
      payment: paymentResult,
    };
  }
}
