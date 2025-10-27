import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PagamentoRepositoryPort } from "../../application/ports/pagamento-repository.port";
import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import {
  AsaasCustomerResponse,
  AsaasCustomerData,
  AsaasPaymentResponse,
  AsaasPixQrCodeResponse,
} from "../../interface/asaas.interface";
import { PostCustomerAsaasRepository } from "../../repositories/postCustomerAsaas.repository";
import { PostPagamentoAsaasRepository } from "../../repositories/postPagamentoAsaas.repository";
import { PostPagamentoAsaasDataDTO } from "../../dtos/postPagamentoAsaasData.dto";
import { PostPagarDataDTO } from "../../dtos/postPagarData.dto";

@Injectable()
export class PagamentoRepositoryAdapter implements PagamentoRepositoryPort {
  constructor(
    private readonly postCustomerRepo: PostCustomerAsaasRepository,
    private readonly postPagamentoRepo: PostPagamentoAsaasRepository
  ) {}

  private readonly asaasApiUrl =
    process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
  private readonly asaasApiKey = process.env.ASAAS_API_KEY || "";

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

  async postPagamento(data: PostPagamentoAsaasDataDTO): Promise<AsaasPaymentResponse> {
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

      const asaasResponse = await response.json();
      
      return {
        id: asaasResponse.id,
        status: "PENDENTE"
      };
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

  async payPayment(data: PostPagarDataDTO): Promise<AsaasPaymentResponse> {
    try {
      const pagamento = await this.getPagamentoById(data.id_pagamento);
      if (!pagamento) {
        throw new HttpException(
          "Pagamento não encontrado",
          HttpStatus.NOT_FOUND
        );
      }

      const response = await fetch(
        `${this.asaasApiUrl}/payments/${pagamento.id_pagamento_asaas}/payWithCreditCard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            access_token: this.asaasApiKey,
          },
          body: JSON.stringify({
            creditCard: {
              holderName: data.creditCard.holderName,
              number: data.creditCard.number,
              expiryMonth: data.creditCard.expiryMonth,
              expiryYear: data.creditCard.expiryYear,
              ccv: data.creditCard.ccv,
            },
            creditCardHolderInfo: {
              name: data.creditCardHolderInfo.name,
              email: data.creditCardHolderInfo.email,
              cpfCnpj: data.creditCardHolderInfo.cpfCnpj,
              postalCode: data.creditCardHolderInfo.postalCode,
              addressNumber: data.creditCardHolderInfo.addressNumber,
              addressComplement: data.creditCardHolderInfo.addressComplement,
              phone: data.creditCardHolderInfo.phone,
              mobilePhone: data.creditCardHolderInfo.mobilePhone,
            },
            remoteIp: data.remoteIp || "127.0.0.1",
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new HttpException(
          error.errors || "Erro ao processar pagamento no Asaas",
          response.status
        );
      }

      const asaasResponse = await response.json();
      
      await this.updatePagamentoStatus(data.id_pagamento, "PAGO");

      return {
        id: asaasResponse.id,
        status: asaasResponse.status || "PAGO"
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Erro ao comunicar com API Asaas",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getPagamentoById(id_pagamento: number): Promise<{ id_pagamento_asaas: string } | null> {
    return this.postPagamentoRepo.getPagamentoById(id_pagamento);
  }

  async updatePagamentoStatus(id_pagamento: number, status: string): Promise<void> {
    return this.postPagamentoRepo.updatePagamentoStatus(id_pagamento, status);
  }

  async getPixQrCode(id_pagamento_asaas: string): Promise<AsaasPixQrCodeResponse> {
    try {
      const response = await fetch(
        `${this.asaasApiUrl}/payments/${id_pagamento_asaas}/pixQrCode`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: this.asaasApiKey,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new HttpException(
          error.errors || "Erro ao obter QR Code PIX do Asaas",
          response.status
        );
      }

      const asaasResponse = await response.json();
      
      return {
        encodedImage: asaasResponse.encodedImage,
        payload: asaasResponse.payload,
        expirationDate: asaasResponse.expirationDate
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Erro ao comunicar com API Asaas para obter QR Code PIX",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
