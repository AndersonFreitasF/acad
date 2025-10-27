import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class DeleteTreinoRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findTreino(id: number): Promise<boolean> {
    const sql = `SELECT 1 FROM treino WHERE id = $1 LIMIT 1`;
    const binds = [id];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async deleteExerciciosTreino(id_treino: number) {
    const sql = `DELETE FROM treino_exercicios WHERE treino_id = $1`;
    const binds = [id_treino];
    await this.dataBaseService.query(sql, binds);
  }

  async deleteTreino(executed_by: number, id: number) {
    const sql = `DELETE FROM treino WHERE id = $1`;
    const binds = [id];
    await this.dataBaseService.query(sql, binds);
  }
}

