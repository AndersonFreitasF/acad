import { GetExercicioDataDTO } from "../../dtos/getExercicioData.dto";
import { PostExercicioDataDTO } from "../../dtos/postExercicioData.dto";
import { PutExercicioDataDTO } from "../../dtos/putExercicioData.dto";
import { Exercicio } from "../../interface/exercicio.interface";

export const ExercicioRepositoryPortToken = "ExercicioRepositoryPort" as const;

export interface ExercicioRepositoryPort {
  countExercicios(params: GetExercicioDataDTO): Promise<number>;
  getExercicios(params: GetExercicioDataDTO): Promise<Exercicio[]>;
  postExercicio(data: PostExercicioDataDTO, createdBy: number): Promise<void>;
  findExercicio(idExercicio: number): Promise<boolean>;
  putExercicio(
    data: PutExercicioDataDTO,
    updatedBy: number,
    idExercicio: number
  ): Promise<void>;
  deleteExercicio(executedBy: number, idExercicio: number): Promise<void>;
}
