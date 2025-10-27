import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { TreinoController } from "./controller/treino.controller";
import { GetTreinoRepository } from "./repositories/getTreino.repository";
import { PostTreinoRepository } from "./repositories/postTreino.repository";
import { PutTreinoRepository } from "./repositories/putTreino.repository";
import { DeleteTreinoRepository } from "./repositories/deleteTreino.repository";
import { GetTreinoService } from "./services/getTreino.service";
import { PostTreinoService } from "./services/postTreino.service";
import { PutTreinoService } from "./services/putTreino.service";
import { DeleteTreinoService } from "./services/deleteTreino.service";
import { TreinoRepositoryAdapter } from "./adapters/repositories/treino.repository.adapter";
import { TreinoRepositoryPortToken } from "./application/ports/treino-repository.port";

@Module({
  imports: [DatabaseModule],
  controllers: [TreinoController],
  providers: [
    GetTreinoRepository,
    PostTreinoRepository,
    PutTreinoRepository,
    DeleteTreinoRepository,
    GetTreinoService,
    PostTreinoService,
    PutTreinoService,
    DeleteTreinoService,
    {
      provide: TreinoRepositoryPortToken,
      useClass: TreinoRepositoryAdapter,
    },
  ],
})
export class TreinoModule {}
