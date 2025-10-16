import { Injectable } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../../application/ports/exercicio-repository.port";
import { PostExercicioDataDTO } from "../../dtos/postExercicioData.dto";
import { PostExercicioRepository } from "../../repositories/postExercicio.repository";

@Injectable()
export class ExercicioRepositoryAdapter implements ExercicioRepositoryPort {
  constructor(
    //private readonly getRepo: GetExercicioRepository,
    private readonly postRepo: PostExercicioRepository
    //private readonly putRepo: PutExercicioRepository,
    //private readonly deleteRepo: DeleteExercicioRepository
  ) {}
  postExercicio(data: PostExercicioDataDTO, createdBy: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  //   async countProfessores(params: GetProfessorDataDTO): Promise<number> {
  //     return this.getRepo.countProfessores(params);
  //   }

  //   async getProfessores(params: GetProfessorDataDTO): Promise<Professor[]> {
  //     return this.getRepo.getProfessores(params);
  //   }

  //   async findUsuario(idUsuario: number): Promise<boolean> {
  //     return this.putRepo.findUsuario(idUsuario);
  //   }

  //   async putProfessor(
  //     data: PutProfessorDataDTO,
  //     updatedBy: number,
  //     idUsuario: number
  //   ): Promise<void> {
  //     await this.putRepo.putProfessor(data, updatedBy, idUsuario);
  //     return;
  //   }

  //   async deleteProfessor(executedBy: number, idUsuario: number): Promise<void> {
  //     await this.deleteRepo.deleteProfessor(executedBy, idUsuario);
  //     return;
  //   }
}
