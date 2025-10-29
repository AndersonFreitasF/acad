import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  PagamentoRepositoryPortToken,
  PagamentoRepositoryPort,
} from "../application/ports/pagamento-repository.port";
import { InternalPaymentStatus } from "../interface/asaas.interface";

@Injectable()
export class CheckPagamentoService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(id_pagamento: number) {
    const pagamento =
      await this.pagamentoRepository.getPagamentoById(id_pagamento);
    if (!pagamento) {
      throw new NotFoundException("Pagamento não encontrado");
    }

    const DataAsaas = await this.pagamentoRepository.getPagamentoByAsaasId(
      pagamento.id_pagamento_asaas
    );

    if (!DataAsaas) {
      throw new NotFoundException("Pagamento Asaas não encontrado");
    }

    if (DataAsaas.status !== pagamento.status) {
      await this.pagamentoRepository.updatePagamentoStatus(
        id_pagamento,
        DataAsaas.status
      );
    }

    return {
      id_pagamento,
      id_pagamento_asaas: pagamento.id_pagamento_asaas,
      status: DataAsaas.status as InternalPaymentStatus,
    };
  }
}
