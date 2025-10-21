import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PostTreinoDataDTO } from "../dtos/postTreinoData.dto";
import { ExercicioTreinoDTO } from "../dtos/exercicioTreinoData.dto";

@Injectable()
export class PostTreinoRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postTreino(data: PostTreinoDataDTO, created_by: number) {
    const sql = `INSERT INTO treino(
      titulo,
      descricao,
      id_professor,
      publico,
      created_at
    ) 
    VALUES($1, $2, $3, $4, NOW())
    RETURNING id, titulo, descricao, id_professor, publico, created_at
    `;

    const binds = [
      data.titulo.toUpperCase(),
      data.descricao.toUpperCase(),
      data.id_professor,
      data.publico || false,
    ];
    
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0];
  }

  async treinoExists(id_treino: number): Promise<boolean> {
    const sql = `SELECT COUNT(*) as total FROM treino WHERE id = $1`;
    const binds = [id_treino];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total > 0;
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