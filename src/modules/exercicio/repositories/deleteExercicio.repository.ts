import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class DeleteExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findExercicio(id_exercicio: number): Promise<boolean> {
    const sql = `SELECT 1 FROM exercicio WHERE id_exercicio = $1 AND deleted_by IS NULL LIMIT 1`;
    const binds = [id_exercicio];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async deleteExercicio(executed_by: number, id_exercicio: number) {
    const sql = `UPDATE exercicio 
    SET 
      deleted_by = $1,
      deleted_at = NOW()
    WHERE id_exercicio = $2`;

    const binds = [executed_by, id_exercicio];

    await this.dataBaseService.query(sql, binds);
  }
}
