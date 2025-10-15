import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { GetProfessorRepository } from "./repositories/getProfessor.repository";
import { ProfessorController } from "./controller/professor.controller";
import { GetProfessorService } from "./services/getProfessor.service";
import { PostProfessorRepository } from "./repositories/postProfessor.repository";
import { PostProfessorService } from "./services/postProfessor.service";
import { PutProfessorRepository } from "./repositories/putProfessor.repository";
import { PutProfessorService } from "./services/putProfessor.service";
import { DeleteProfessorRepository } from "./repositories/deleteProfessor.repository";
import { DeleteProfessorService } from "./services/deleteProfessor.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ProfessorController],
  providers: [
    PostProfessorRepository,
    PostProfessorService,
    GetProfessorRepository,
    GetProfessorService,
    PutProfessorRepository,
    PutProfessorService,
    DeleteProfessorRepository,
    DeleteProfessorService,
  ],
})
export class ProfessorModule {}
