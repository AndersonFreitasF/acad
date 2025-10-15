import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { GetProfessorRepository } from "./repositories/getProfessor.repository";
import { ProfessorController } from "./controller/professor.controller";
import { PostProfessorRepository } from "./repositories/postProfessor.repository";
import { PutProfessorRepository } from "./repositories/putProfessor.repository";
import { DeleteProfessorRepository } from "./repositories/deleteProfessor.repository";
import { GetProfessorService } from "./services/getProfessor.service";
import { PostProfessorService } from "./services/postProfessor.service";
import { PutProfessorService } from "./services/putProfessor.service";
import { DeleteProfessorService } from "./services/deleteProfessor.service";
import { ProfessorRepositoryAdapter } from "./infrastructure/repositories/professor.repository.adapter";
import { ProfessorRepositoryPortToken } from "./application/ports/professor-repository.port";


@Module({
  imports: [DatabaseModule],
  controllers: [ProfessorController],
  providers: [
    GetProfessorRepository,
    PostProfessorRepository,
    PutProfessorRepository,
    DeleteProfessorRepository,
    GetProfessorService,
    PostProfessorService,
    PutProfessorService,
    DeleteProfessorService,

    {
      provide: ProfessorRepositoryPortToken,
      useClass: ProfessorRepositoryAdapter,
    },
  ],
})
export class ProfessorModule {}
