import { Module } from "@nestjs/common";
import { PagamentoController } from "./controller/pagamento.controller";
import { PostCustomerAsaasService } from "./services/postCustomerAsaas.service";
import { PostPagamentoAsaasService } from "./services/postPagamentoAsaas.service"; // 👈 novo service
import { PagamentoRepositoryAdapter } from "./adapters/repositories/pagamento.repository.adapter";
import { PagamentoRepositoryPortToken } from "./application/ports/pagamento-repository.port";
import { PostCustomerAsaasRepository } from "./repositories/postCustomerAsaas.repository";
import { PostPagamentoAsaasRepository } from "./repositories/postPagamentoAsaas.repository"; // 👈 novo repo
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [PagamentoController],
  providers: [
    PostCustomerAsaasService,
    PostPagamentoAsaasService,
    PostCustomerAsaasRepository,
    PostPagamentoAsaasRepository,
    {
      provide: PagamentoRepositoryPortToken,
      useClass: PagamentoRepositoryAdapter,
    },
  ],
})
export class PagamentoModule {}
