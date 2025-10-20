import { PostTreinoDataDTO } from "../../dtos/postTreinoData.dto";
import { GetTreinoDataDTO } from "../../dtos/getTreinoData.dto";
import { PutTreinoDataDTO } from "../../dtos/putTreinoData.dto";
import { Treino } from "../../interface/treino.interface";

export const TreinoRepositoryPortToken = "TreinoRepositoryPort" as const;

export interface TreinoRepositoryPort {
  countTreinos(params: GetTreinoDataDTO): Promise<number>;
  getTreinos(params: GetTreinoDataDTO): Promise<Treino[]>;
  postTreino(data: PostTreinoDataDTO, createdBy: number): Promise<Treino>;
  treinoExists(idTreino: number): Promise<boolean>;
  findTreino(idTreino: number): Promise<boolean>;
  putTreino(data: PutTreinoDataDTO, updatedBy: number, idTreino: number): Promise<void>;
  removeExercicios(treino_id: number): Promise<void>;
  addExercicio(exercicio: any, treino_id: number, ordem: number): Promise<void>;
  deleteExerciciosTreino(id_treino: number): Promise<void>;
  deleteTreino(executedBy: number, idTreino: number): Promise<void>;
}
