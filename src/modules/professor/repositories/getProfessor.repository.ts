import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";

@Injectable()
export class GetProfessorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countProfessores(data: GetProfessorDataDTO) {
    const sql = `SELECT COUNT(DISTINCT u.id_usuario) as total
        FROM usuario u
        LEFT JOIN professor_treino tt ON tt.id_professor = u.id_usuario
        LEFT JOIN treino t ON t.id = tt.id_treino
            WHERE u.tipo = 'PROFESSOR'
            AND u.deleted_by IS NULL
            AND ($1 = '' OR u.nome ILIKE $1)`;

    const binds = [data.nome ? `%${data.nome}%` : ""];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getProfessores(data: GetProfessorDataDTO) {
    const sql = `
    SELECT 
        u.id_usuario,
        u.nome, 
        u.email, 
        ARRAY_AGG(t.id) AS treinos
    FROM usuario u
    LEFT JOIN professor_treino tt ON tt.id_professor = u.id_usuario
    LEFT JOIN treino t ON t.id = tt.id_treino
    WHERE u.tipo = 'PROFESSOR'
        AND u.deleted_by IS NULL
        AND ($1 = '' OR u.nome ILIKE $1)
  GROUP BY u.id_usuario, u.nome, u.email
  ORDER BY u.id_usuario
  LIMIT $2
  OFFSET $3`;
    const binds = [
      data.nome ? `%${data.nome}%` : "",
      data.size,
      (data.page - 1) * data.size,
    ];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
