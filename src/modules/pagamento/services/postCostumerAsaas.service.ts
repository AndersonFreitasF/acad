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

  async postCostumer(data: CreateCostumerAsaasDTO, id_usuario: number) {
    const dadosUsuario =
      await this.pagamentoRepository.getDadosUsuario(id_usuario);
    ((data.email = dadosUsuario.email), (data.cpfCnpj = dadosUsuario.CpfCnpj));
    data.name = dadosUsuario.name;

    return await this.pagamentoRepository.postCustomer(data);
  }
}
