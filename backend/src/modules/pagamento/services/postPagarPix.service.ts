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
import { PostPagarPixDataDTO } from "../dtos/postPagarPixData.dto";
import { InternalPaymentStatus } from "../interface/asaas.interface";

@Injectable()
export class PostPagarPixService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(data: PostPagarPixDataDTO) {
    const pagamento = await this.pagamentoRepository.getPagamentoById(
      data.id_pagamento
    );
    if (!pagamento) throw new NotFoundException("Pagamento não encontrado");

    if (pagamento.status === InternalPaymentStatus.PAID) {
      throw new BadRequestException("Pagamento já realizado");
    }

    const qrCodeData = await this.pagamentoRepository.getPixQrCode(
      pagamento.id_pagamento_asaas
    );

    await this.pagamentoRepository.updatePagamentoStatus(
      data.id_pagamento,
      InternalPaymentStatus.PENDING
    );

    return {
      success: true,
      message: "QR Code PIX gerado com sucesso",
      qrCode: {
        encodedImage: qrCodeData.encodedImage,
        payload: qrCodeData.payload,
        expirationDate: qrCodeData.expirationDate,
      },
    };
  }
}
