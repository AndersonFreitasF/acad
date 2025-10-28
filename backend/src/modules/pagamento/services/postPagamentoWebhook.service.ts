import { Injectable, BadRequestException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { Inject } from "@nestjs/common";
import { AsaasWebhookDTO } from "../dtos/asaasWebhook.dto";
import { mapAsaasStatus } from "../interface/assas-status.mapper";

@Injectable()
export class PostPagamentoWebhookService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(data: AsaasWebhookDTO) {
    if (!data.payment?.id) {
      throw new BadRequestException("id do pagamento Invalido");
    }

    const pagamento = await this.pagamentoRepository.getPagamentoByAsaasId(
      data.payment.id
    );
    if (!pagamento) {
      throw new BadRequestException("Pagamento não encontrado");
    }

    const novoStatus = mapAsaasStatus(data.payment.status);
    if (pagamento.status === novoStatus) return { ok: true };

    await this.pagamentoRepository.updatePagamentoStatus(
      pagamento.id,
      novoStatus
    );

    return { ok: true };
  }
}
