import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";

import { PostPagarCreditCardService } from "./services/postPagarCreditCard.service";
import { PostPagarPixService } from "./services/postPagarPix.service";
import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamento.repository.adapter";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamento-repository.port";

import { PostPagamentoAsaasRepository } from "./repositories/postPagamentoAsaas.repository";
import { DatabaseModule } from "../database/database.module";
import { PostPagamentoAsaasService } from "./services/postPagamentoAsaas.service";
import { PostPagamentoWebhookService } from "./services/postPagamentoWebhook.service";
import { CheckPagamentoService } from "./services/getPagamentoStatus.service";

@Module({
  imports: [DatabaseModule],
  controllers: [PagamentoController],
  providers: [
    PostPagarCreditCardService,
    PostPagarPixService,

    PostPagamentoAsaasRepository,
    PostPagamentoAsaasService,
    PostPagamentoWebhookService,
    CheckPagamentoService,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
