import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetUsuarioDataDTO } from "../dtos/getUsuarioData.dto";

@Injectable()
export class GetUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async countUsuarios(data: GetUsuarioDataDTO) {
    const sql = `SELECT COUNT(*) as total
        FROM usuario
        WHERE tipo = 'ALUNO'
        AND deleted_at IS NULL
        AND ($1 = '' OR nome ILIKE $1)`;

    const binds = [data.nome ? `%${data.nome}%` : ""];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0]?.total ?? 0;
  }

  async getUsuarios(data: GetUsuarioDataDTO) {
    const sql = `
    SELECT 
        id_usuario,
        nome, 
        email,
        cpf,
        tipo
    FROM usuario
    WHERE tipo = 'ALUNO'
        AND deleted_at IS NULL
        AND ($1 = '' OR nome ILIKE $1)
    ORDER BY id_usuario
    LIMIT $2
    OFFSET $3
`;

    const page = Number(data.page) || 1;
    const size = Number(data.size) || 10;
    const binds = [
      data.nome ? `%${data.nome}%` : "",
      size,
      (page - 1) * size
    ];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows ?? [];
  }
}
