import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetTreinadorDataDTO } from "../dtos/getTreinadorData.dto";

@Injectable()
export class GetTreinadorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countTreinadores(data: GetTreinadorDataDTO) {
    const sql = `SELECT COUNT(DISTINCT u.id_usuario) as total
        FROM usuario u
        LEFT JOIN treinador_treino tt ON tt.id_treinador = u.id_usuario
        LEFT JOIN treino t ON t.id_treino = tt.id_treino
            WHERE u.tipo = 'PROFESSOR'
            AND u.deleted_by IS NULL
            AND ($1 = '' OR u.nome ILIKE $1)`;

    const binds = [data.nome ? `%${data.nome}%` : ""];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getTreinadores(data: GetTreinadorDataDTO) {
    const sql = `
    SELECT 
        u.id_usuario,
        u.nome, 
        u.email, 
        ARRAY_AGG(t.id_treino) AS treinos
    FROM usuario u
    LEFT JOIN treinador_treino tt ON tt.id_treinador = u.id_usuario
    LEFT JOIN treino t ON t.id_treino = tt.id_treino
    WHERE u.tipo = 'PROFESSOR'
        AND u.deleted_by IS NULL
        AND ($1 = '' OR u.nome ILIKE $1)
    GROUP BY u.id_usuario, u.nome, u.email
    ORDER BY u.id_usuario
    LIMIT $2
    OFFSET $3
    `;

    const binds = [
      data.nome ? `%${data.nome}%` : "",
      data.size,
      (data.page - 1) * data.size,
    ];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
