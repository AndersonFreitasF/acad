import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { GetExercicioRepository } from "./repositories/getExercicio.repository";
import { ExercicioController } from "./controller/exercicio.controller";
import { PostExercicioRepository } from "./repositories/postExercicio.repository";
import { PutExercicioRepository } from "./repositories/putExercicio.repository";
import { DeleteExercicioRepository } from "./repositories/deleteExercicio.repository";
import { ExercicioRepositoryAdapter } from "./adapters/repositories/exercicio.repository.adapter";
import { ExercicioRepositoryPortToken } from "./application/ports/exercicio-repository.port";
import { GetExercicioService } from "./services/getExercicio.service";
import { PostExercicioService } from "./services/postExercicio.service";
import { PutExercicioService } from "./services/putExercicio.service";
import { DeleteExercicioService } from "./services/deleteExercicio.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ExercicioController],
  providers: [
    GetExercicioRepository,
    PostExercicioRepository,
    PutExercicioRepository,
    DeleteExercicioRepository,
    GetExercicioService,
    PostExercicioService,
    PutExercicioService,
    DeleteExercicioService,
    {
      provide: ExercicioRepositoryPortToken,
      useClass: ExercicioRepositoryAdapter,
    },
  ],
})
export class ExercicioModule {}
