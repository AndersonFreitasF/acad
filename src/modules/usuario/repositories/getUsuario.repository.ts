import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetUsuarioDataDTO } from "../dtos/getUsuarioData.dto";

@Injectable()
export class GetUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countUsuarios(data: GetUsuarioDataDTO) {
    const sql = `SELECT COUNT(DISTINCT u.id_usuario) as total
    FROM usuario u
    LEFT JOIN usuario_treino ut ON ut.id_usuario = u.id_usuario
    LEFT JOIN treino t ON t.id = ut.id_treino
        WHERE u.tipo = 'ALUNO'
        AND u.deleted_by IS NULL
        ${data.nome ? `AND u.nome ILIKE $1` : ""}`;

    const binds = data.nome ? [`%${data.nome}%`] : [];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getUsuarios(data: GetUsuarioDataDTO) {
    const sql = `
  SELECT 
    u.id_usuario,
    u.nome, 
    u.email, 
    ARRAY_AGG(t.id) AS treinos
  FROM usuario u
  LEFT JOIN usuario_treino ut ON ut.id_usuario = u.id_usuario
  LEFT JOIN treino t ON t.id = ut.id_treino
  WHERE u.tipo = 'ALUNO'
    AND u.deleted_by IS NULL
    AND ($1 = '' OR u.nome ILIKE $1)
  GROUP BY u.id_usuario, u.nome, u.email
  ORDER BY u.id_usuario
  LIMIT $2
  OFFSET $3
`;

    const binds = data.nome 
      ? [`%${data.nome}%`, data.size, (data.page - 1) * data.size]
      : ["", data.size, (data.page - 1) * data.size];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
