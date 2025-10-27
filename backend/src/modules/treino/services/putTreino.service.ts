import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PutTreinoDataDTO } from "../dtos/putTreinoData.dto";
import {
  TreinoRepositoryPort,
  TreinoRepositoryPortToken,
} from "../application/ports/treino-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";

@Injectable()
export class PutTreinoService {
  constructor(
    @Inject(TreinoRepositoryPortToken)
    private readonly repo: TreinoRepositoryPort
  ) {}

  async execute(
    data: PutTreinoDataDTO,
    user: TokenPayload,
    id_treino: number
  ) {
    try {

      if (!data.titulo && !data.descricao && data.publico === undefined && !data.exercicios) {
        throw new BadRequestException('Pelo menos um campo deve ser informado para atualização');
      }

      const treinoExists = await this.repo.findTreino(id_treino);

      if (!treinoExists) {
        throw new NotFoundException("Treino não encontrado");
      }

      await this.repo.putTreino(data, user.id_usuario, id_treino);

      if (data.exercicios && data.exercicios.length >= 3) {
        await this.repo.removeExercicios(id_treino);
        
        for (let i = 0; i < data.exercicios.length; i++) {
          await this.repo.addExercicio(data.exercicios[i], id_treino, i + 1);
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Não foi possível atualizar o treino"
      );
    }
  }
}

