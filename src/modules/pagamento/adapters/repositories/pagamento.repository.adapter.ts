import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PagamentoRepositoryPort } from "../../application/ports/pagamento-repository.port";
import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import {
  AsaasCustomerResponse,
  AsaasCustomerData,
} from "../../interface/asaas.interface";
import { PostCustomerAsaasRepository } from "../../repositories/postCustomerAsaas.repository";
import { PostPagamentoAsaasRepository } from "../../repositories/postPagamentoAsaas.repository";
import { PostPagamentoAsaasDataDTO } from "../../dtos/postPagamentoAsaasData.dto";

@Injectable()
export class PagamentoRepositoryAdapter implements PagamentoRepositoryPort {
  constructor(
    private readonly postCustomerRepo: PostCustomerAsaasRepository,
    private readonly postPagamentoRepo: PostPagamentoAsaasRepository
  ) {}

  private readonly asaasApiUrl =
    process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
  private readonly asaasApiKey = process.env.ASAAS_API_KEY || "";

  // --- Criar cliente ---
  async postCustomer(
    data: PostCustomerAsaasDataDTO
  ): Promise<AsaasCustomerResponse> {
    try {
      const response = await fetch(`${this.asaasApiUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: this.asaasApiKey,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new HttpException(
          error.errors || "Erro ao criar cliente no Asaas",
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Erro ao comunicar com API Asaas",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // --- Criar pagamento ---
  async postPagamento(data: PostPagamentoAsaasDataDTO): Promise<any> {
    try {
      const response = await fetch(`${this.asaasApiUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: this.asaasApiKey,
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
        const error = await response.json();
        throw new HttpException(
          error.errors || "Erro ao criar pagamento no Asaas",
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Erro ao comunicar com API Asaas",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDadosUsuario(id_usuario: number): Promise<AsaasCustomerData | null> {
    return this.postCustomerRepo.getDadosUsuario(id_usuario);
  }

  async vincularCustomerId(
    id_usuario: number,
    customerId: string
  ): Promise<void> {
    return this.postCustomerRepo.vincularCustomerId(id_usuario, customerId);
  }

  async savePagamento(
    id_usuario: number,
    id_pagamento: string,
    valor: number,
    tipo: string,
    status: string
  ): Promise<void> {
    return this.postPagamentoRepo.savePagamento(
      id_usuario,
      id_pagamento,
      valor,
      tipo,
      status
    );
  }
}
