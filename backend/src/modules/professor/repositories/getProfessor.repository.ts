import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";

@Injectable()
export class GetProfessorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countProfessores(data: GetProfessorDataDTO) {
    const sql = `SELECT COUNT(*) as total
        FROM usuario
        WHERE tipo = 'PROFESSOR'
        AND deleted_at IS NULL
        AND ($1 = '' OR nome ILIKE $1)`;

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
        u.cpf,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('id', t.id, 'titulo', t.titulo, 'preco', t.preco)
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'::JSON
        ) AS treinos
    FROM usuario u
    LEFT JOIN treino t ON t.id_professor = u.id_usuario AND t.deleted_at IS NULL
    WHERE u.tipo = 'PROFESSOR'
        AND u.deleted_at IS NULL
        AND ($1 = '' OR u.nome ILIKE $1)
    GROUP BY u.id_usuario, u.nome, u.email, u.cpf
    ORDER BY u.id_usuario
    LIMIT $2
    OFFSET $3`;
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
