import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class DeleteExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findExercicio(id: number): Promise<boolean> {
    const sql = `SELECT 1 FROM exercicio WHERE id = $1 LIMIT 1`;
    const binds = [id];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async deleteExercicio(executed_by: number, id: number) {
    const sql = `DELETE FROM exercicio WHERE id = $1`;

    const binds = [id];

    await this.dataBaseService.query(sql, binds);
  }
}
