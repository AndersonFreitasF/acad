import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { GetTreinadorRepository } from "./repositories/getTreinador.repository";
import { TreinadorController } from "./controller/treinador.controller";
import { GetTreinadorService } from "./services/getTreinador.service";

@Module({
  imports: [DatabaseModule],
  controllers: [TreinadorController],
  providers: [
    //PostTreinadorRepository,
    //PostTreinadorService,
    GetTreinadorRepository,
    GetTreinadorService,
    //PutTreinadorRepository,
    //PutTreinadorService,
    //DeleteTreinadorRepository,
    //DeleteTreinadorService,
  ],
})
export class TreinadorModule {}
