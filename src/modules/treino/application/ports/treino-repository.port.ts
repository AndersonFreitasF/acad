import { PostTreinoDataDTO } from "../../dtos/postTreinoData.dto";
import { Treino } from "../../interface/treino.interface";

export const TreinoRepositoryPortToken = "TreinoRepositoryPort" as const;

export interface TreinoRepositoryPort {
  //countTreinos(params: GetTreinoDataDTO): Promise<number>;
  //getTreinos(params: GetTreinoDataDTO): Promise<Treino[]>;
  postTreino(data: PostTreinoDataDTO, createdBy: number): Promise<void>;
  //   findTreino(idTreino: number): Promise<boolean>;
  //   putTreino(
  //     data: PutTreinoDataDTO,
  //     updatedBy: number,
  //     idTreino: number
  //   ): Promise<void>;
  //deleteTreino(executedBy: number, idTreino: number): Promise<void>;
}
