import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";
import { PostPagamentoService } from "./services/postPagamento.service";
import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamentoAsaas.repository";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamentoAsaas.repository";

@Module({
  controllers: [PagamentoController],
  providers: [
    PostPagamentoService,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
