import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PutTreinoDataDTO } from "../dtos/putTreinoData.dto";
import { ExercicioTreinoDTO } from "../dtos/exercicioTreinoData.dto";

@Injectable()
export class PutTreinoRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findTreino(id: number): Promise<boolean> {
    const sql = `SELECT 1 FROM treino WHERE id = $1 LIMIT 1`;
    const binds = [id];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async putTreino(
    data: PutTreinoDataDTO,
    update_by: number,
    id: number
  ) {
    const sql = ` UPDATE treino
  SET
    titulo = COALESCE($1, titulo),
    descricao = COALESCE($2, descricao),
    publico = COALESCE($3, publico),
    updated_at = NOW()
  WHERE id = $4`;

    const binds = [
      data.titulo ? data.titulo.toUpperCase() : null,
      data.descricao ? data.descricao.toUpperCase() : null,
      data.publico !== undefined ? data.publico : null,
      id,
    ];

    await this.dataBaseService.query(sql, binds);
  }

  async removeExercicios(treino_id: number) {
    const sql = `DELETE FROM treino_exercicios WHERE treino_id = $1`;
    const binds = [treino_id];
    await this.dataBaseService.query(sql, binds);
  }

  async addExercicio(exercicio: ExercicioTreinoDTO, treino_id: number, ordem: number) {
    const sql = `INSERT INTO treino_exercicios(
      treino_id,
      exercicio_id,
      series_repeticoes,
      carga,
      observacoes,
      ordem,
      created_at
    ) 
    VALUES($1, $2, $3, $4, $5, $6, NOW())
    `;

    const binds = [
      treino_id,
      exercicio.id_exercicio,
      exercicio.series_repeticoes || null,
      exercicio.carga || null,
      exercicio.observacoes || null,
      ordem,
    ];
    
    await this.dataBaseService.query(sql, binds);
  }
}

