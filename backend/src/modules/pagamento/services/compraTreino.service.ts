import { BadRequestException, ConflictException, Inject, Injectable } from "@nestjs/common";
import { CompraRepository } from "../repositories/compra.repository";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { CompraTreinoRequestDto, CompraTreinoCardResponseDto, CompraTreinoPixResponseDto } from "../dtos/compraTreino.dto";
import { InternalPaymentStatus } from "../interface/asaas.interface";
import { PostCustomerAsaasService } from "../../usuario/services/postCustomerAsaas.service";

@Injectable()
export class CompraTreinoService {
  constructor(
    private readonly compraRepo: CompraRepository,
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepo: PagamentoRepositoryPort,
    private readonly postCustomerAsaasService: PostCustomerAsaasService
  ) {}

  async comprar(id_usuario: number, data: CompraTreinoRequestDto): Promise<CompraTreinoPixResponseDto | CompraTreinoCardResponseDto> {
    if (!data?.treinoId) throw new BadRequestException("treinoId obrigatório");
    if (data.metodo !== "PIX" && data.metodo !== "CREDIT_CARD") {
      throw new BadRequestException("metodo inválido");
    }
    const treino = await this.compraRepo.getTreinoById(data.treinoId);
    if (!treino) throw new BadRequestException("Treino não encontrado");
    if (await this.compraRepo.usuarioJaPossuiTreino(id_usuario, data.treinoId)) {
      throw new ConflictException("Usuário já possui acesso a este treino");
    }

    let customerId = await this.compraRepo.getAsaasCustomerId(id_usuario);
    
    // Create ASAAS customer on-demand if not found
    if (!customerId) {
      try {
        const customer = await this.postCustomerAsaasService.execute(id_usuario);
        customerId = customer.id;
      } catch (error) {
        throw new BadRequestException("Falha ao criar cliente no sistema de pagamentos. Tente novamente mais tarde.");
      }
    }

    const payment = await this.pagamentoRepo.postPagamento({
      customerId: customerId as any,
      value: Number(treino.preco),
      billingType: data.metodo,
      description: `Compra do treino #${treino.id}`,
      id_usuario,
    } as any);

    const pagamentoId = await this.compraRepo.salvarPagamento(
      id_usuario,
      payment.id,
      Number(treino.preco),
      data.metodo,
      InternalPaymentStatus.PENDING
    );
    await this.compraRepo.vincularTreinoPagamento(data.treinoId, pagamentoId);

    if (data.metodo === "PIX") {
      const qr = await this.pagamentoRepo.getPixQrCode(payment.id);
      return {
        paymentId: payment.id,
        qrCodeImage: qr.encodedImage,
        copyPaste: qr.payload,
        expirationDate: qr.expirationDate,
      };
    }
    if (!data.card || !data.holderInfo) {
      throw new BadRequestException("Dados de cartão e holderInfo são obrigatórios");
    }

    const paid = await (this.pagamentoRepo as any).payPayment({
      id_pagamento: pagamentoId,
      creditCard: data.card,
      creditCardHolderInfo: data.holderInfo,
    } as any);

    return { paymentId: paid.id, status: paid.status };
  }
}


