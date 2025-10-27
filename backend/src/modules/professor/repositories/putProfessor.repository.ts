import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PutProfessorDataDTO } from "../dtos/putProfessorData.dto";

@Injectable()
export class PutProfessorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findUsuario(id_usuario: number): Promise<boolean> {
    const sql = `SELECT 1 FROM usuario WHERE id_usuario = $1 LIMIT 1`;
    const binds = [id_usuario];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async putProfessor(
    data: PutProfessorDataDTO,
    update_by: number,
    id_usuario: number
  ) {
    const sql = ` UPDATE usuario
  SET
    nome = COALESCE($1, nome),
    email = COALESCE($2, email),
    senha = COALESCE($3, senha),
    updated_by = $4,
    updated_at = NOW()
  WHERE id_usuario = $5;`;

    const binds = [
      data.nome ? data.nome.toUpperCase() : null,
      data.email ? data.email.toUpperCase() : null,
      data.senha ?? null,
      update_by,
      id_usuario,
    ];

    await this.dataBaseService.query(sql, binds);
  }
}
