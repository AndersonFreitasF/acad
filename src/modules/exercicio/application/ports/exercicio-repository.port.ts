import { PostExercicioDataDTO } from "../../dtos/postExercicioData.dto";

export const ExercicioRepositoryPortToken = "ExercicioRepositoryPort" as const;

export interface ExercicioRepositoryPort {
  postExercicio(data: PostExercicioDataDTO, createdBy: number): Promise<void>;
}
