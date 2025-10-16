import { Injectable } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../../application/ports/exercicio-repository.port";
import { GetExercicioDataDTO } from "../../dtos/getExercicioData.dto";
import { PostExercicioDataDTO } from "../../dtos/postExercicioData.dto";
import { PutExercicioDataDTO } from "../../dtos/putExercicioData.dto";
import { Exercicio } from "../../interface/exercicio.interface";
import { GetExercicioRepository } from "../../repositories/getExercicio.repository";
import { PostExercicioRepository } from "../../repositories/postExercicio.repository";
import { PutExercicioRepository } from "../../repositories/putExercicio.repository";
import { DeleteExercicioRepository } from "../../repositories/deleteExercicio.repository";

@Injectable()
export class ExercicioRepositoryAdapter implements ExercicioRepositoryPort {
  constructor(
    private readonly getRepo: GetExercicioRepository,
    private readonly postRepo: PostExercicioRepository,
    private readonly putRepo: PutExercicioRepository,
    private readonly deleteRepo: DeleteExercicioRepository
  ) {}

  async countExercicios(params: GetExercicioDataDTO): Promise<number> {
    return this.getRepo.countExercicios(params);
  }

  async getExercicios(params: GetExercicioDataDTO): Promise<Exercicio[]> {
    return this.getRepo.getExercicios(params);
  }

  async postExercicio(data: PostExercicioDataDTO, createdBy: number): Promise<void> {
    await this.postRepo.postExercicio(data, createdBy);
    return;
  }

  async findExercicio(idExercicio: number): Promise<boolean> {
    return this.putRepo.findExercicio(idExercicio);
  }

  async putExercicio(
    data: PutExercicioDataDTO,
    updatedBy: number,
    idExercicio: number
  ): Promise<void> {
    await this.putRepo.putExercicio(data, updatedBy, idExercicio);
    return;
  }

  async deleteExercicio(executedBy: number, idExercicio: number): Promise<void> {
    await this.deleteRepo.deleteExercicio(executedBy, idExercicio);
    return;
  }
}
