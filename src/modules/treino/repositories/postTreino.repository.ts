import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PostTreinoDataDTO } from "../dtos/postTreinoData.dto";

@Injectable()
export class PostTreinoRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postTreino(data: PostTreinoDataDTO, id_professor: number) {
    const sql = `INSERT INTO exercicio(
          titulo,
          descricao,
          id_professor,
          created_at
          ) 
          VALUES($1, $2, $3, NOW())
          `;

    const binds = [
      data.titulo.toUpperCase(),
      data.descricao.toUpperCase(),
      data.id_professor,
    ];
    await this.dataBaseService.query(sql, binds);
  }
}
