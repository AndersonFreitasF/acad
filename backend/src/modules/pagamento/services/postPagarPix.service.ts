import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostPagarPixDataDTO } from "../dtos/postPagarPixData.dto";

@Injectable()
export class PostPagarPixService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(data: PostPagarPixDataDTO) {
    try {
      const pagamento = await this.pagamentoRepository.getPagamentoById(data.id_pagamento);
      if (!pagamento) {
        throw new NotFoundException("Pagamento não encontrado");
      }

      const qrCodeData = await this.pagamentoRepository.getPixQrCode(pagamento.id_pagamento_asaas);

      return {
        success: true,
        message: "QR Code PIX gerado com sucesso",
        qrCode: {
          encodedImage: qrCodeData.encodedImage,
          payload: qrCodeData.payload,
          expirationDate: qrCodeData.expirationDate,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Pagamento não encontrado");
      }
      throw error;
    }
  }
}
