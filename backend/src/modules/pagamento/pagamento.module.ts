import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";
import { PostCustomerAsaasService } from "./services/postCustomerAsaas.service";

import { PostPagarCreditCardService } from "./services/postPagarCreditCard.service";
import { PostPagarPixService } from "./services/postPagarPix.service";
import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamento.repository.adapter";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamento-repository.port";
import { PostCustomerAsaasRepository } from "./repositories/postCustomerAsaas.repository";
import { PostPagamentoAsaasRepository } from "./repositories/postPagamentoAsaas.repository";
import { DatabaseModule } from "../database/database.module";
import { PostPagamentoAsaasService } from "./services/postPagamentoAsaas.service";

@Module({
  imports: [DatabaseModule],
  controllers: [PagamentoController],
  providers: [
    PostCustomerAsaasService,
    PostPagarCreditCardService,
    PostPagarPixService,
    PostCustomerAsaasRepository,
    PostPagamentoAsaasRepository,
    PostPagamentoAsaasService,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
