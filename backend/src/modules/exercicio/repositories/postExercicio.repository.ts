import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PostExercicioDataDTO } from "../dtos/postExercicioData.dto";

@Injectable()
export class PostExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postExercicio(data: PostExercicioDataDTO, created_by: number) {
    const sql = `INSERT INTO exercicio(
      nome,
      descricao,
      created_by,
      created_at
      ) 
      VALUES($1, $2, $3, NOW())
      `;

    const binds = [
      data.nome.toUpperCase(),
      data.descricao.toUpperCase(),
      created_by,
    ];
    await this.dataBaseService.query(sql, binds);
  }
}
