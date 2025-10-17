import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PutExercicioDataDTO } from "../dtos/putExercicioData.dto";

@Injectable()
export class PutExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findExercicio(id: number): Promise<boolean> {
    const sql = `SELECT 1 FROM exercicio WHERE id = $1 LIMIT 1`;
    const binds = [id];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async putExercicio(
    data: PutExercicioDataDTO,
    update_by: number,
    id: number
  ) {
    const sql = ` UPDATE exercicio
  SET
    nome = COALESCE($1, nome),
    descricao = COALESCE($2, descricao)
  WHERE id = $3;`;

    const binds = [
      data.nome ? data.nome.toUpperCase() : null,
      data.descricao ? data.descricao.toUpperCase() : null,
      id,
    ];

    await this.dataBaseService.query(sql, binds);
  }
}
