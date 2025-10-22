import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PagamentoRepositoryPort } from "../../application/ports/pagamento-repository.port";
import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import { AsaasCustomerResponse, AsaasCustomerData } from "../../interface/asaas.interface";
import { PostCustomerAsaasRepository } from "../../repositories/postCustomerAsaas.repository";

@Injectable()
export class PagamentoRepositoryAdapter implements PagamentoRepositoryPort {
  constructor(
    private readonly postCustomerRepo: PostCustomerAsaasRepository
  ) {}

  private readonly asaasApiUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
  private readonly asaasApiKey = process.env.ASAAS_API_KEY || "";

  async postCustomer(data: PostCustomerAsaasDataDTO): Promise<AsaasCustomerResponse> {
    try {
      const response = await fetch(`${this.asaasApiUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access_token": this.asaasApiKey,
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Erro ao comunicar com API Asaas",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDadosUsuario(id_usuario: number): Promise<AsaasCustomerData | null> {
    return await this.postCustomerRepo.getDadosUsuario(id_usuario);
  }
}

