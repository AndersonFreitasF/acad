import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PutExercicioDataDTO } from "../dtos/putExercicioData.dto";

@Injectable()
export class PutExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findExercicio(id_exercicio: number): Promise<boolean> {
    const sql = `SELECT 1 FROM exercicio WHERE id_exercicio = $1 AND deleted_by IS NULL LIMIT 1`;
    const binds = [id_exercicio];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async putExercicio(
    data: PutExercicioDataDTO,
    update_by: number,
    id_exercicio: number
  ) {
    const sql = ` UPDATE exercicio
  SET
    nome = COALESCE($1, nome),
    descricao = COALESCE($2, descricao),
    updated_by = $3,
    updated_at = NOW()
  WHERE id_exercicio = $4;`;

    const binds = [
      data.nome ? data.nome.toUpperCase() : null,
      data.descricao ? data.descricao.toUpperCase() : null,
      update_by,
      id_exercicio,
    ];

    await this.dataBaseService.query(sql, binds);
  }
}
