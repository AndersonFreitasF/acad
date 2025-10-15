import { Injectable } from "@nestjs/common";
import {
  ProfessorRepositoryPort,
} from "../../application/ports/professor-repository.port";
import { GetProfessorDataDTO } from "../../dtos/getProfessorData.dto";
import { PostProfessorDataDTO } from "../../dtos/postProfessorData.dto";
import { PutProfessorDataDTO } from "../../dtos/putProfessorData.dto";
import { Professor } from "../../interface/professor.interface";
import { GetProfessorRepository } from "../../repositories/getProfessor.repository";
import { PostProfessorRepository } from "../../repositories/postProfessor.repository";
import { PutProfessorRepository } from "../../repositories/putProfessor.repository";
import { DeleteProfessorRepository } from "../../repositories/deleteProfessor.repository";

@Injectable()
export class ProfessorRepositoryAdapter implements ProfessorRepositoryPort {
  constructor(
    private readonly getRepo: GetProfessorRepository,
    private readonly postRepo: PostProfessorRepository,
    private readonly putRepo: PutProfessorRepository,
    private readonly deleteRepo: DeleteProfessorRepository
  ) {}

  async countProfessores(params: GetProfessorDataDTO): Promise<number> {
    return this.getRepo.countProfessores(params);
  }

  async getProfessores(params: GetProfessorDataDTO): Promise<Professor[]> {
    return this.getRepo.getProfessores(params);
  }

  async postUsuario(data: PostProfessorDataDTO, createdBy: number): Promise<void> {
    await this.postRepo.postUsuario(data, createdBy);
    return;
  }

  async findUsuario(idUsuario: number): Promise<boolean> {
    return this.putRepo.findUsuario(idUsuario);
  }

  async putProfessor(
    data: PutProfessorDataDTO,
    updatedBy: number,
    idUsuario: number
  ): Promise<void> {
    await this.putRepo.putProfessor(data, updatedBy, idUsuario);
    return;
  }

  async deleteProfessor(executedBy: number, idUsuario: number): Promise<void> {
    await this.deleteRepo.deleteProfessor(executedBy, idUsuario);
    return;
  }
}


