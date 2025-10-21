import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";
import { PostCostumerAsaasService } from "./services/postCostumerAsaas.service";
import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamentoAsaas.repository";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamentoAsaas.repository";

@Module({
  controllers: [PagamentoController],
  providers: [
    PostCostumerAsaasService,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
