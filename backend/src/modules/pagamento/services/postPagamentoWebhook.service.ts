import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { Inject } from "@nestjs/common";
import { AsaasWebhookDTO } from "../dtos/asaasWebhook.dto";
import { mapAsaasStatus } from "../interface/assas-status.mapper";
import { CompraRepository } from "../repositories/compra.repository";
import * as crypto from "crypto";

@Injectable()
export class PostPagamentoWebhookService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort,
    private readonly compraRepo: CompraRepository
  ) {}

  private verifySignature(rawBody: string, signature?: string) {
    const secretHex = process.env.ASAAS_WEBHOOK_SECRET;
    if (!secretHex) return true;
    if (!signature) throw new UnauthorizedException("Assinatura ausente");
    const secret = Buffer.from(secretHex, "hex");
    const h = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (h !== signature) throw new UnauthorizedException("Assinatura inválida");
  }

  async execute(data: AsaasWebhookDTO, rawBody?: string, signature?: string) {
    if (rawBody) this.verifySignature(rawBody, signature);
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

    if (novoStatus === "PAID") {
      const treinos = await this.compraRepo.getTreinosPorPagamento(pagamento.id);
      const byAsaas = await this.compraRepo.getPagamentoByAsaasId(data.payment.id);
      if (byAsaas) {
        for (const t of treinos) {
          await this.compraRepo.concederAcessoUsuarioTreino(byAsaas.id_usuario, t);
        }
      }
    }
    return { ok: true };
  }
}
