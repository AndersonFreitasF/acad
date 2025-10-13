import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetUsuarioInputDto } from "../dtos/getUsuarioData.dto";

@Injectable()
export class GetUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countUsuarios() {
    const sql = `SELECT COUNT(DISTINCT u.id_usuario) as total
    FROM usuario u
    LEFT JOIN usuario_treino ut ON ut.id_usuario = u.id_usuario
    LEFT JOIN treino t ON t.id_treino = ut.id_treino
        WHERE u.tipo = 'ALUNO'
        AND deleted_by IS NULL`;

    const result = await this.dataBaseService.query(sql);
    return result?.rows[0]?.total ?? 0;
  }

  async getUsuarios(data: GetUsuarioInputDto) {
    const sql = `
    SELECT 
      u.id_usuario,
      u.nome, 
      u.email, 
      ARRAY_AGG(t.id_treino) AS treinos
    FROM usuario u
    LEFT JOIN usuario_treino ut ON ut.id_usuario = u.id_usuario
    LEFT JOIN treino t ON t.id_treino = ut.id_treino
    WHERE u.tipo = 'ALUNO'
    AND u.deleted_by IS NULL
    GROUP BY u.id_usuario,u.nome, u.email
    ORDER BY u.id_usuario
    LIMIT $1 OFFSET $2
  `;
    const binds = [data.size, (data.page - 1) * data.size];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
