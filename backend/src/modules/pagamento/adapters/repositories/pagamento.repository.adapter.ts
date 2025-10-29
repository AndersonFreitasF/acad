import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PagamentoRepositoryPort } from "../../application/ports/pagamento-repository.port";
import { PostCustomerAsaasDataDTO } from "../../../usuario/dtos/postCustomerAsaasData.dto";
import {
  AsaasPaymentResponse,
  AsaasPixQrCodeResponse,
  InternalPaymentStatus,
} from "../../interface/asaas.interface";

import { PostPagamentoAsaasRepository } from "../../repositories/postPagamentoAsaas.repository";
import { PostPagamentoAsaasDataDTO } from "../../dtos/postPagamentoAsaasData.dto";
import { PostPagarDataDTO } from "../../dtos/postPagarData.dto";
import { mapAsaasStatus } from "../../interface/assas-status.mapper";

@Injectable()
export class PagamentoRepositoryAdapter implements PagamentoRepositoryPort {
  constructor(
    private readonly postPagamentoRepo: PostPagamentoAsaasRepository
  ) {}

  async postPagamento(
    data: PostPagamentoAsaasDataDTO
  ): Promise<AsaasPaymentResponse> {
    const response = await fetch(`${process.env.ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: data.customerId,
        value: data.value,
        billingType: data.billingType,
        description: data.description ?? "Pagamento gerado pelo sistema",
        dueDate: new Date().toISOString().split("T")[0],
      }),
    });

    if (!response.ok) {
      throw new HttpException(await response.json(), response.status);
    }

    const asa = await response.json();
    return { id: asa.id, status: InternalPaymentStatus.PENDING };
  }

  async savePagamento(
    id_usuario: number,
    id_pagamento: string,
    valor: number,
    tipo: string,
    status: InternalPaymentStatus
  ): Promise<void> {
    return this.postPagamentoRepo.savePagamento(
      id_usuario,
      id_pagamento,
      valor,
      tipo,
      status
    );
  }

  async payPayment(data: PostPagarDataDTO): Promise<AsaasPaymentResponse> {
    const pagamento = await this.getPagamentoById(data.id_pagamento);

    if (!pagamento) throw new HttpException("Pagamento não encontrado", 404);

    const response = await fetch(
      `${process.env.ASAAS_API_URL}/payments/${pagamento.id_pagamento_asaas}/payWithCreditCard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new HttpException(await response.json(), response.status);
    }

    const asa = await response.json();
    const mapped = mapAsaasStatus(asa.status);

    await this.updatePagamentoStatus(data.id_pagamento, mapped);

    return { id: asa.id, status: mapped };
  }

  async getPagamentoById(id_pagamento: number) {
    return this.postPagamentoRepo.getPagamentoById(id_pagamento);
  }

  async updatePagamentoStatus(
    id_pagamento: number,
    status: InternalPaymentStatus
  ): Promise<void> {
    return this.postPagamentoRepo.updatePagamentoStatus(id_pagamento, status);
  }

  async getPixQrCode(
    id_pagamento_asaas: string
  ): Promise<AsaasPixQrCodeResponse> {
    const response = await fetch(
      `${process.env.ASAAS_API_URL}/payments/${id_pagamento_asaas}/pixQrCode`,
      { method: "GET", headers: { access_token: process.env.ASAAS_API_KEY } }
    );

    if (!response.ok) {
      throw new HttpException(await response.json(), response.status);
    }

    return await response.json();
  }

  async getPagamentoByAsaasId(id_pagamento_asaas: string) {
    return this.postPagamentoRepo.getPagamentoByAsaasId(id_pagamento_asaas);
  }
}
