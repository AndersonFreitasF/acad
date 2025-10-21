import axios from "axios";
import { Injectable } from "@nestjs/common";
import { PagamentoRepositoryPort } from "../../application/ports/pagamentoAsaas.repository";
import { CreateCostumerAsaasDTO } from "../../dtos/CreateCostumerAsaasData.dto";

@Injectable()
export class PagamentoRepositoryAdapter implements PagamentoRepositoryPort {
  private readonly client = axios.create({
    baseURL: "https://api.asaas.com/v3",
    headers: {
      "Content-Type": "application/json",
      acess_token: process.env.ASAAS_API_KEY,
    },
  });

  async postCustomer(data: CreateCostumerAsaasDTO) {
    const response = await this.client.post("/customers", data);
    return response.data;
  }
}
