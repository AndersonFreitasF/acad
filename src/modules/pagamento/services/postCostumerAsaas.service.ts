import { Inject, Injectable } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamentoAsaas.repository";
import { CreateCostumerAsaasDTO } from "../dtos/CreateCostumerAsaasData.dto";

@Injectable()
export class PostCostumerAsaasService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async postCostumer(data: CreateCostumerAsaasDTO) {
    return await this.pagamentoRepository.postCustomer(data);
  }
}
