import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetExercicioDataDTO } from "../dtos/getExercicioData.dto";

@Injectable()
export class GetExercicioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countExercicios(data: GetExercicioDataDTO) {
    const sql = `SELECT COUNT(DISTINCT e.id) as total
        FROM exercicio e
        WHERE ($1 = '' OR e.nome ILIKE $1)`;

    const binds = [data.nome ? `%${data.nome}%` : ""];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getExercicios(data: GetExercicioDataDTO) {
    const sql = `
    SELECT 
        e.id as id_exercicio,
        e.nome, 
        e.descricao,
        e.created_by,
        e.created_at
    FROM exercicio e
    WHERE ($1 = '' OR e.nome ILIKE $1)
    ORDER BY e.id
    LIMIT $2
    OFFSET $3
    `;

    const page = Number(data.page) || 1;
    const size = Number(data.size) || 10;
    
    const binds = [
      data.nome ? `%${data.nome}%` : "",
      size,
      (page - 1) * size,
    ];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
