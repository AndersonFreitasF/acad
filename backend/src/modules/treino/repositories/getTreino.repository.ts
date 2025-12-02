import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetTreinoDataDTO } from "../dtos/getTreinoData.dto";

@Injectable()
export class GetTreinoRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countTreinos(data: GetTreinoDataDTO) {
    const sql = `SELECT COUNT(DISTINCT t.id) as total
        FROM treino t
        WHERE ($1 = '' OR t.titulo ILIKE $1)
        AND ($2::INTEGER IS NULL OR t.id_professor = $2)`;

    const binds = [
      data.titulo ? `%${data.titulo}%` : "",
      data.id_professor ?? null
    ];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getTreinos(data: GetTreinoDataDTO) {
    const sql = `
    SELECT 
        t.id,
        t.titulo, 
        t.descricao,
        t.id_professor,
        t.preco,
        t.created_at
    FROM treino t
    WHERE ($1 = '' OR t.titulo ILIKE $1)
    AND ($2::INTEGER IS NULL OR t.id_professor = $2)
    ORDER BY t.id
    LIMIT $3
    OFFSET $4
    `;

    const page = Number(data.page) || 1;
    const size = Number(data.size) || 10;
    
    const binds = [
      data.titulo ? `%${data.titulo}%` : "",
      data.id_professor ?? null,
      size,
      (page - 1) * size,
    ];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}

