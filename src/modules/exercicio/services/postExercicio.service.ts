import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  ExercicioRepositoryPortToken,
  ExercicioRepositoryPort,
} from "../application/ports/exercicio-repository.port";
import { PostExercicioDataDTO } from "../dtos/postExercicioData.dto";

@Injectable()
export class PostExercicioService {
  constructor(
    @Inject(ExercicioRepositoryPortToken)
    private readonly repo: ExercicioRepositoryPort
  ) {}

  async execute(data: PostExercicioDataDTO, created_by: number) {
    try {
      await this.repo.postExercicio(data, created_by);
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o exercício"
      );
    }
  }
}
