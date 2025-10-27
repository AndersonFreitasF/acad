import { Injectable } from "@nestjs/common";
import { TreinoRepositoryPort } from "../../application/ports/treino-repository.port";
import { PostTreinoDataDTO } from "../../dtos/postTreinoData.dto";
import { GetTreinoDataDTO } from "../../dtos/getTreinoData.dto";
import { PutTreinoDataDTO } from "../../dtos/putTreinoData.dto";
import { Treino } from "../../interface/treino.interface";
import { GetTreinoRepository } from "../../repositories/getTreino.repository";
import { PostTreinoRepository } from "../../repositories/postTreino.repository";
import { PutTreinoRepository } from "../../repositories/putTreino.repository";
import { DeleteTreinoRepository } from "../../repositories/deleteTreino.repository";
import { ExercicioTreinoDTO } from "../../dtos/exercicioTreinoData.dto";

@Injectable()
export class TreinoRepositoryAdapter implements TreinoRepositoryPort {
  constructor(
    private readonly getRepo: GetTreinoRepository,
    private readonly postRepo: PostTreinoRepository,
    private readonly putRepo: PutTreinoRepository,
    private readonly deleteRepo: DeleteTreinoRepository
  ) {}

  async countTreinos(params: GetTreinoDataDTO): Promise<number> {
    return this.getRepo.countTreinos(params);
  }

  async getTreinos(params: GetTreinoDataDTO): Promise<Treino[]> {
    return this.getRepo.getTreinos(params);
  }

  async postTreino(data: PostTreinoDataDTO, createdBy: number): Promise<Treino> {
    return await this.postRepo.postTreino(data, createdBy);
  }

  async treinoExists(idTreino: number): Promise<boolean> {
    return this.postRepo.treinoExists(idTreino);
  }

  async findTreino(idTreino: number): Promise<boolean> {
    return this.putRepo.findTreino(idTreino);
  }

  async putTreino(data: PutTreinoDataDTO, updatedBy: number, idTreino: number): Promise<void> {
    await this.putRepo.putTreino(data, updatedBy, idTreino);
    return;
  }

  async removeExercicios(treino_id: number): Promise<void> {
    await this.putRepo.removeExercicios(treino_id);
    return;
  }

  async addExercicio(exercicio: ExercicioTreinoDTO, treino_id: number, ordem: number): Promise<void> {
    await this.putRepo.addExercicio(exercicio, treino_id, ordem);
    return;
  }

  async deleteExerciciosTreino(id_treino: number): Promise<void> {
    await this.deleteRepo.deleteExerciciosTreino(id_treino);
    return;
  }

  async deleteTreino(executedBy: number, idTreino: number): Promise<void> {
    await this.deleteRepo.deleteTreino(executedBy, idTreino);
    return;
  }
}
