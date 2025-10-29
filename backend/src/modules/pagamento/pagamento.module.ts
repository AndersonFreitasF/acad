import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";

import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamento.repository.adapter";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamento-repository.port";

import { PostPagamentoAsaasRepository } from "./repositories/postPagamentoAsaas.repository";
import { DatabaseModule } from "../database/database.module";
import { PostPagamentoAsaasService } from "./services/postPagamentoAsaas.service";
import { PostPagamentoWebhookService } from "./services/postPagamentoWebhook.service";
import { CheckPagamentoService } from "./services/getPagamentoStatus.service";
import { CompraTreinoService } from "./services/compraTreino.service";
import { CompraRepository } from "./repositories/compra.repository";
import { UsuarioModule } from "../usuario/usuario.module";

@Module({
  imports: [DatabaseModule, UsuarioModule],
  controllers: [PagamentoController],
  providers: [
    PostPagamentoAsaasRepository,
    PostPagamentoAsaasService,
    PostPagamentoWebhookService,
    CheckPagamentoService,
    CompraTreinoService,
    CompraRepository,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
