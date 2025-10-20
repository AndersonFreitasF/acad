import { Injectable } from "@nestjs/common";
import { TreinoRepositoryPort } from "../../application/ports/treino-repository.port";

import { PostTreinoDataDTO } from "../../dtos/postTreinoData.dto";
import { Treino } from "../../interface/treino.interface";

import { PostTreinoRepository } from "../../repositories/postTreino.repository";

@Injectable()
export class TreinoRepositoryAdapter implements TreinoRepositoryPort {
  constructor(
    //private readonly getRepo: GetTreinoRepository,
    private readonly postRepo: PostTreinoRepository
    //private readonly putRepo: PutTreinoRepository,
    //private readonly deleteRepo: DeleteTreinoRepository
  ) {}

  //   async countTreinos(params: GetTreinoDataDTO): Promise<number> {
  //     return this.getRepo.countTreinos(params);
  //   }

  //   async getTreinos(params: GetTreinoDataDTO): Promise<Treino[]> {
  //     return this.getRepo.getTreinos(params);
  //}

  async postTreino(data: PostTreinoDataDTO, createdBy: number): Promise<void> {
    await this.postRepo.postTreino(data, createdBy);
    return;
  }

  //   async findTreino(idTreino: number): Promise<boolean> {
  //     return this.putRepo.findTreino(idTreino);
  //   }

  //   async putTreino(
  //     data: PutTreinoDataDTO,
  //     updatedBy: number,
  //     idTreino: number
  //   ): Promise<void> {
  //     await this.putRepo.putTreino(data, updatedBy, idTreino);
  //     return;
  //   }

  //   async deleteTreino(executedBy: number, idTreino: number): Promise<void> {
  //     await this.deleteRepo.deleteTreino(executedBy, idTreino);
}
